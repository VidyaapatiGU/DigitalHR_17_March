const { validationResult, matchedData } = require("express-validator");
const logger = require("../config/logger.js");
const Attendance = require("../models/Attendance.js");
const Employee = require("../models/Employee.js");
const Leaves = require("../models/Leaves.js");
const Client = require("../models/Client.js");

const normalizeInt = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getAttendancePeriod = (value) => {
  const match = String(value || "").match(/^(\d{4})-(\d{1,2})/);
  if (match) return { year: Number(match[1]), month: Number(match[2]) };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { year: 0, month: 0 };
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
};

const getMonthNumber = (value) => {
  const numericMonth = Number(value);
  if (Number.isInteger(numericMonth) && numericMonth >= 1 && numericMonth <= 12) return numericMonth;
  const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
  ];
  const monthText = String(value || "").trim().toLowerCase();
  if (!monthText) return 0;
  const monthIndex = monthNames.findIndex((name) => name === monthText || name.startsWith(monthText));
  return monthIndex < 0 ? 0 : monthIndex + 1;
};

const parseAbsentDaysToIsoDates = (value, year, month) => {
  if (value == null) return [];
  const targetYear = Number(year);
  const targetMonth = Number(month);
  if (!Number.isInteger(targetYear) || !Number.isInteger(targetMonth) || targetMonth < 1 || targetMonth > 12) return [];
  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  const isoDates = new Set();
  const addDate = (dateYear, dateMonth, dateDay) => {
    if (dateYear < 100) dateYear += 2000;
    if (dateYear !== targetYear || dateMonth !== targetMonth || dateDay < 1 || dateDay > daysInMonth) return;
    const date = new Date(dateYear, dateMonth - 1, dateDay);
    if (
      date.getFullYear() !== dateYear ||
      date.getMonth() + 1 !== dateMonth ||
      date.getDate() !== dateDay
    ) return;
    isoDates.add(String(dateYear) + "-" + String(dateMonth).padStart(2, "0") + "-" + String(dateDay).padStart(2, "0"));
  };
  const addDay = (day) => addDate(targetYear, targetMonth, Number(day));
  const addExcelSerial = (serial) => {
    const date = new Date(Date.UTC(1899, 11, 30) + Number(serial) * 86400000);
    if (!Number.isNaN(date.getTime())) {
      addDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
    }
  };
  const handleToken = (token) => {
    const isoDateMatch = token.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:T.*)?$/);
    if (isoDateMatch) {
      const [, dateYear, dateMonth, dateDay] = isoDateMatch;
      addDate(Number(dateYear), Number(dateMonth), Number(dateDay));
      return;
    }
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(token)) {
      const [dateDay, dateMonth, dateYear] = token.split("/").map(Number);
      addDate(dateYear, dateMonth, dateDay);
      return;
    }
    if (/^\d{1,2}-\d{1,2}$/.test(token)) {
      const [start, end] = token.split("-").map(Number);
      for (let day = Math.min(start, end); day <= Math.max(start, end); day += 1) addDay(day);
      return;
    }
    if (/^\d{1,2}(\.\d{1,2})+$/.test(token)) {
      token.split(".").forEach(addDay);
      return;
    }
    if (/^\d+(\.\d+)?$/.test(token)) {
      const numericValue = Number(token);
      if (numericValue > 31) addExcelSerial(numericValue);
      else addDay(numericValue);
    }
  };

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    addDate(value.getFullYear(), value.getMonth() + 1, value.getDate());
  } else if (typeof value === "number") {
    if (value > 31) addExcelSerial(value);
    else addDay(value);
  } else if (Array.isArray(value)) {
    value.forEach((entry) => parseAbsentDaysToIsoDates(entry, targetYear, targetMonth).forEach((date) => isoDates.add(date)));
  } else {
    String(value)
      .trim()
      .replace(/[;|]+/g, ",")
      .split(/[\s,]+/)
      .map((token) => token.trim())
      .filter(Boolean)
      .forEach(handleToken);
  }
  return Array.from(isoDates).sort();
};

const reconcileEmployeeLeaveBalances = async (clientUserId) => {
  const clientReference = String(clientUserId || "");
  const client = await Client.findOne({
    $or: [{ _id: clientReference }, { user_id: clientReference }],
  }).select("_id user_id").lean();
  const clientReferences = Array.from(new Set([
    clientReference,
    client?._id ? String(client._id) : "",
    client?.user_id ? String(client.user_id) : "",
  ].filter(Boolean)));

  const [employees, attendanceRecords, leaveDefaultRecords] = await Promise.all([
    Employee.find({
      $or: [
        { client_user_id: { $in: clientReferences } },
        { client_id: { $in: clientReferences } },
        { user_id: { $in: clientReferences } },
      ],
    }).select("_id emp_no leaves").lean(),
    Attendance.find({ client_user_id: { $in: clientReferences } })
      .select("emp_no month_year month year numberOfCL absentDaysCL numberOfSL absentDaysSL numberOfPL absentDaysPL")
      .lean(),
    Leaves.find({ client_id: { $in: clientReferences } }).lean(),
  ]);
  const leaveDefaults = leaveDefaultRecords.find(
    (record) => client?._id && String(record.client_id) === String(client._id)
  ) || leaveDefaultRecords.find(
    (record) => String(record.client_id) === clientReference
  ) || leaveDefaultRecords[0] || null;

  const typeFields = {
    cl: { count: "numberOfCL", dates: "absentDaysCL" },
    sl: { count: "numberOfSL", dates: "absentDaysSL" },
    pl: { count: "numberOfPL", dates: "absentDaysPL" },
  };
  const usageByEmployee = new Map();

  for (const record of attendanceRecords) {
    const empNo = String(record.emp_no || "").trim();
    if (!empNo) continue;

    let period = getAttendancePeriod(record.month_year);
    if (!period.year || !period.month) {
      period = { year: Number(record.year), month: getMonthNumber(record.month) };
    }
    const periodKey = period.year && period.month
      ? `${period.year}-${String(period.month).padStart(2, "0")}`
      : `unknown-${record._id}`;

    if (!usageByEmployee.has(empNo)) {
      usageByEmployee.set(empNo, {
        cl: new Map(),
        sl: new Map(),
        pl: new Map(),
      });
    }
    const employeeUsage = usageByEmployee.get(empNo);

    for (const [type, fields] of Object.entries(typeFields)) {
      const periodUsage = employeeUsage[type].get(periodKey) || { dates: new Set(), fallbackCount: 0 };
      const dates = period.year && period.month
        ? parseAbsentDaysToIsoDates(record[fields.dates], period.year, period.month)
        : [];
      if (dates.length > 0) {
        dates.forEach((date) => periodUsage.dates.add(date));
      } else {
        // Keep support for older attendance rows that stored only leave counts.
        periodUsage.fallbackCount = Math.max(
          periodUsage.fallbackCount,
          normalizeInt(record[fields.count])
        );
      }
      employeeUsage[type].set(periodKey, periodUsage);
    }
  }

  const configuredDefault = (type) => {
    let value = leaveDefaults?.leaves?.[type];
    if (Array.isArray(value)) value = value[0];
    if (value && typeof value === "object") value = value.balance;
    if (value == null || String(value).trim() === "") return null;
    return normalizeInt(value);
  };

  const ops = employees.map((employee) => {
    const employeeUsage = usageByEmployee.get(String(employee.emp_no || "").trim()) || {};
    const nextLeaves = {};

    for (const type of Object.keys(typeFields)) {
      const current = employee.leaves?.[type] || {};
      const currentDates = Array.isArray(current.absentDates)
        ? Array.from(new Set(current.absentDates.map((date) => String(date))))
        : [];
      const inferredStartingBalance = normalizeInt(current.balance) + currentDates.length;
      const defaultBalance = configuredDefault(type);
      // The client leave policy is the authoritative starting balance. Using
      // the employee's already-reduced balance here would preserve stale low
      // balances after the attendance records that caused them are deleted.
      const startingBalance = defaultBalance == null ? inferredStartingBalance : defaultBalance;

      const dates = new Set();
      let countOnlyUsage = 0;
      for (const periodUsage of employeeUsage[type]?.values() || []) {
        if (periodUsage.dates.size > 0) {
          periodUsage.dates.forEach((date) => dates.add(date));
        } else {
          countOnlyUsage += periodUsage.fallbackCount;
        }
      }

      const absentDates = Array.from(dates).sort();
      nextLeaves[type] = {
        balance: String(startingBalance - absentDates.length - countOnlyUsage),
        absentDates,
      };
    }

    return {
      updateOne: {
        filter: { _id: employee._id },
        update: { $set: { leaves: nextLeaves, updated_at: Date.now() } },
      },
    };
  });

  if (ops.length > 0) await Employee.bulkWrite(ops, { ordered: false });

  return {
    employeesUpdated: ops.length,
    attendanceRecords: attendanceRecords.length,
    defaultsAvailable: Object.fromEntries(
      Object.keys(typeFields).map((type) => [type, configuredDefault(type) != null])
    ),
  };
};

//@desc Test Attendance API
//@route GET /api/v1/attendance
//@access Private: Needs Login
const testAttendanceAPI = async (req, res) => {
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/attendance | User: ${user.name} | responnded with Attendance Api Successful `
    );
    return res
      .status(200)
      .send({ data: user, message: "Attendance Api Successful" });
  } else {
    logger.error(
      `${ip}: API /api/v1/attendance | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Create New Attendance
//@route POST /api/v1/attendance/add/:id
//@access Private: Needs Login
const addAttendance = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const data = matchedData(req); // Contains the validated input data
  const employeeData = data.employeeData;

  console.log("Received data:", data);
  //console.log("req.params.id:", req.params.id);
  logger.info(`${ip}: Received data: ${JSON.stringify(data)}`);
  // If validation errors exist, respond with 400
  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/attendance/add/:id responded with validation errors`
    );
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    let attendanceRecords = [];
    let errorList = [];
    const period = getAttendancePeriod(data.month_year);

    // Iterate through each employee and save attendance
    for (let i = 0; i < employeeData.length; i++) {
      try {
        const attendance = await Attendance.create({
          client_user_id: req.params.id,
          month_year: data.month_year,
          email: employeeData[i].email,
          name: employeeData[i].name,
          emp_no: employeeData[i].emp_code,
          present: employeeData[i].present,
          totalWorkingDays: data.totalWorkingDays,
          numberOfLOP: employeeData[i].numberOfLOP,
          absentDaysLOP: parseAbsentDaysToIsoDates(employeeData[i].absentDaysLOP, period.year, period.month).join(","),
          numberOfCL: employeeData[i].numberOfCL,
          absentDaysCL: parseAbsentDaysToIsoDates(employeeData[i].absentDaysCL, period.year, period.month).join(","),
          numberOfPL: employeeData[i].numberOfPL,
          absentDaysPL: parseAbsentDaysToIsoDates(employeeData[i].absentDaysPL, period.year, period.month).join(","),
          numberOfSL: employeeData[i].numberOfSL,
          absentDaysSL: parseAbsentDaysToIsoDates(employeeData[i].absentDaysSL, period.year, period.month).join(","),
          reasonCode: employeeData[i].reasonCode,
          lastWorkingDay: employeeData[i].lastWorkingDay,
          month: data.month,
          year: data.year,
          remark: employeeData[i].remark || "NA",
        });

        console.log(attendance);

        logger.info(
          `${ip}: API /api/v1/attendance/add/:id | User: ${user.name} | Attendance added successfully`
        );
        attendanceRecords.push(attendance);
      } catch (err) {
        logger.error(
          `${ip}: API /api/v1/attendance/add/:id | User: ${user.name} | Error: ${err.message}`
        );
        errorList.push({ employee: employeeData[i].name, error: err.message });
      }
    }

    if (errorList.length > 0) {
      return res.status(207).json({
        message: "Some entries failed",
        data: attendanceRecords,
        errors: errorList,
      });
    } else {
      return res.status(201).json({
        message: "All attendance entries added successfully",
        data: attendanceRecords,
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/attendance/add/:id | Unauthorized user attempt`
    );
    return res.status(401).send({ message: "User is not authorized" });
  }
};

//@desc Create New Attendance
//@route POST /api/v1/attendance/add/single/:client_user_id"
//@access Private: Needs Login
const addSingleAttendance = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const data = matchedData(req); // Contains the validated input data

  console.log("Received data:", data);
  console.log("req.params.id:", req.params.client_user_id);

  // If validation errors exist, respond with 400
  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/attendance/add/:id responded with validation errors`
    );
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    try {
      const attendance = await Attendance.create({
        client_user_id: req.params.client_user_id,
        month_year: data.month_year,
        email: data.email,
        name: data.name,
        emp_no: data.emp_no,
        present: data.present,
        totalWorkingDays: data.totalWorkingDays,

        month: data.month,
        year: data.year,
        gross: data.gross,
        reasonCode: data.reasonCode,
        lastWorkingDay: data.lastWorkingDay,
        remark: data.remark || "NA",
      });

      logger.info(
        `${ip}: API /api/v1/attendance/add/:id | User: ${user.name} | Attendance added successfully`
      );
      return res.status(201).json({
        message: "Attendance added successfully",
        data: attendance,
      });
    } catch (err) {
      logger.error(
        `${ip}: API /api/v1/attendance/add/:id | User: ${user.name} | Error: ${err.message}`
      );
      return res.status(400).json({
        errors: [{ employee: data.name, error: err.message }],
      });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/attendance/add/:id | Unauthorized user attempt`
    );
    return res.status(401).send({ message: "User is not authorized" });
  }
};

//@desc Get All Attendance by client_user_id
//@route GET /api/v1/attendance/get/all/:client_user_id
//@access Private: Needs Login
const getAllAttendanceByClient = async (req, res) => {
  const client_user_id = req.params.client_user_id;
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    const attendance = await Attendance.find({
      client_user_id,
    }).sort({ month_year: -1 });
    if (attendance) {
      logger.info(
        `${ip}: API /api/v1/attendance/get/all/:client_user_id | User: ${user.name} | responnded with Success `
      );
      return res.status(200).json(attendance);
    } else {
      logger.error(
        `${ip}: API /api/v1/attendance/get/all/:client_user_id | User: ${user.name} | responnded with Attendance Not Found `
      );
      return res.status(404).json({ message: "Attendance Not Found" });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/attendance/get/all/:client_user_id | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Attendance by  month_year
//@route GET /api/v1/attendance/get/:client_user_id/:month_year
//@access Private: Needs Login
const getAttendanceById = async (req, res) => {
  logger.info("getAttendanceById function started");
  const data = matchedData(req);
  const client_user_id = req.params.client_user_id;
  const month_year = req.params.month_year;

  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    const attendance = await Attendance.find({
      client_user_id: client_user_id,
      month_year: month_year,
    });
    if (attendance) {
      logger.info(
        `${ip}: API /api/v1/attendance/get/:client_user_id/:month_year | User: ${user.name} | responnded with Success `
      );
      return res.status(200).json(attendance);
    } else {
      logger.error(
        `${ip}: API /api/v1/attendance/get/:client_user_id/:month_year | User: ${user.name} | responnded with Attendance Not Found `
      );
      return res.status(404).json({ message: "Attendance Not Found" });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/attendance/get/:client_user_id/:month_year | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get Latest Attendance by client_user_id
//@route GET /api/v1/attendance/get/latest/:id
//@access Private: Needs Login
const getLatestAttendance = async (req, res) => {
  const client_user_id = req.params.id;
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    try {
      const attendance = await Attendance.findOne({
        client_user_id,
      }).sort({ month_year: -1, createDate: -1 });
      if (attendance) {
        logger.info(
          `${ip}: API /api/v1/attendance/get/latest/:client_user_id | User: ${user.name} | responnded with Success `
        );
        //console.log("attendance", attendance);
        return res.status(200).json(attendance);
      } else {
        logger.error(
          `${ip}: API /api/v1/attendance/get/latest/:client_user_id | User: ${user.name} | responnded with Attendance Not Found `
        );
        return res.status(404).json({ message: "Attendance Not Found" });
      }
    } catch (err) {
      logger.error(
        `${ip}: API /api/v1/attendance/get/latest/:client_user_id | User: ${user.name} | responnded with Error `
      );
      return res.status(500).json({ error: "Error", message: err.message });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/attendance/get/latest/:client_user_id | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Edit AttendanceData by emp_id
//@route PUT /api/v1/attendance/edit/attendance_id
//@access Private: Needs Login
const editAttendanceData = async (req, res) => {
  const data = matchedData(req); // Extract validated and sanitized data
  const { attendance_id } = req.params; // Extract params from request
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    try {
      const existingAttendance = await Attendance.findById(attendance_id).select("month_year").lean();
      if (!existingAttendance) {
        return res.status(404).json({ message: "Attendance Not Found" });
      }
      const period = getAttendancePeriod(existingAttendance.month_year);

      const attendance = await Attendance.findOneAndUpdate(
        {
          _id: attendance_id,
        },
        {
          name: data.name,
          emp_no: data.emp_no,
          present: data.present,
          totalWorkingDays: data.totalWorkingDays,
          remark: data.remark,
          numberOfLOP: data.numberOfLOP,
          absentDaysLOP: parseAbsentDaysToIsoDates(data.absentDaysLOP, period.year, period.month).join(","),
          numberOfCL: data.numberOfCL,
          absentDaysCL: parseAbsentDaysToIsoDates(data.absentDaysCL, period.year, period.month).join(","),
          numberOfSL: data.numberOfSL,
          absentDaysSL: parseAbsentDaysToIsoDates(data.absentDaysSL, period.year, period.month).join(","),
          numberOfPL: data.numberOfPL,
          absentDaysPL: parseAbsentDaysToIsoDates(data.absentDaysPL, period.year, period.month).join(","),
        },
        { new: true }
      );

      if (attendance) {
        logger.info(
          `${ip}: API /api/v1/attendance/edit/:id | User: ${user.name} | responded with Success`
        );
        return res.status(200).json(attendance);
      } else {
        logger.error(
          `${ip}: API /api/v1/attendance/edit/:id | User: ${user.name} | responded with Attendance Not Found`
        );
        return res.status(404).json({ message: "Attendance Not Found" });
      }
    } catch (err) {
      logger.error(
        `${ip}: API /api/v1/attendance/edit/:id | User: ${user.name} | responded with Error: ${err.message}`
      );
      return res.status(500).json({ error: "Error", message: err.message });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/attendance/edit/:id | User: ${user.name} | responded with User is not Authorized`
    );
    return res.status(401).send({ message: "User is not Authorized" });
  }
};

//@desc Get AttendanceData by attendanceId and empId
//@route GET /api/v1/attendance/get/employee/:attendance_id
//@access Private: Needs Login
const getEmployeeAttendance = async (req, res) => {
  const { attendance_id } = req.params;
  console.log("attendance_id", attendance_id);
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    try {
      const attendance = await Attendance.findOne({
        _id: attendance_id,
      });

      if (attendance) {
        logger.info(
          `${ip}: API /api/v1/attendance/get/employee/:attendance_id | User: ${user.name} | responded with Success`
        );
        return res.status(200).json(attendance);
      } else {
        logger.error(
          `${ip}: API /api/v1/attendance/get/employee/:attendance_id | User: ${user.name} | responded with Attendance Not Found`
        );
        return res.status(404).json({ message: "Attendance Not Found" });
      }
    } catch (err) {
      logger.error(
        `${ip}: API /api/v1/attendance/get/employee/:attendance_id | User: ${user.name} | responded with Error: ${err.message}`
      );
      return res.status(500).json({ error: "Error", message: err.message });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/attendance/get/employee/:attendance_id | User: ${user.name} | responded with User is not Authorized`
    );
    return res.status(401).send({ message: "User is not Authorized" });
  }
};

//@desc Get AttendanceData by from month_year to to month_year and emp_id
//@route GET /api/v1/attendance/get/from/to/:id/:emp_id
//@access Private: Needs Login
const getAttendaceFromTo = async (req, res) => {
  const { id, emp_id } = req.params; // Extract id and emp_id from params
  const data = matchedData(req); // Get the validated input data (from, to)
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    console.log("Client User ID: ", id);
    console.log("Employee ID: ", emp_id);
    console.log("Data: ", data);

    try {
      // Query the Attendance collection
      const attendance = await Attendance.find(
        {
          client_user_id: id, // Match the client_user_id
          month_year: { $gte: data.from, $lte: data.to }, // Filter by date range
          AttendanceData: {
            $elemMatch: { emp_id: emp_id }, // Match only the specific emp_id in AttendanceData
          },
        },
        {
          "AttendanceData.$": 1, // Only return the matched element in AttendanceData array
        }
      ).sort({ month_year: 1 });

      if (attendance && attendance.length > 0) {
        logger.info(
          `${ip}: API /api/v1/attendance/get/from/:from/to/:to/:id/:emp_id | User: ${user.name} | responded with Success`
        );
        return res.status(200).json(attendance);
      } else {
        logger.error(
          `${ip}: API /api/v1/attendance/get/from/:from/to/:to/:id/:emp_id | User: ${user.name} | responded with Attendance Not Found`
        );
        return res.status(404).json({ message: "Attendance Not Found" });
      }
    } catch (err) {
      logger.error(
        `${ip}: API /api/v1/attendance/get/from/:from/to/:to/:id/:emp_id | User: ${user.name} | responded with Error: ${err.message}`
      );
      return res.status(500).json({ error: "Error", message: err.message });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/attendance/get/from/:from/to/:to/:id/:emp_id | User: ${user.name} | responded with User is not Authorized`
    );
    return res.status(401).send({ message: "User is not Authorized" });
  }
};

//@desc Get AttendanceData by from month_year to to month_year
//@route GET /api/v1/attendance/get/from/to/::id/:email
//@access Private: Needs Login
const getAttendaceFromTo2 = async (req, res) => {
  const { email } = req.params; // Extract email from params
  const data = matchedData(req); // Get the validated input data (from, to)
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    console.log("Client Email: ", email);
    console.log("Data: ", data);

    try {
      // Query the Attendance collection by email
      const attendance = await Attendance.find({
        email: email, // Match the email
        month_year: { $gte: data.from, $lte: data.to }, // Filter by date range
      }).sort({ month_year: 1 });

      if (attendance && attendance.length > 0) {
        logger.info(
          `${ip}: API /api/v1/attendance/get/from/:from/to/:to/:email | User: ${user.name} | responded with Success`
        );
        return res.status(200).json(attendance);
      } else {
        logger.error(
          `${ip}: API /api/v1/attendance/get/from/:from/to/:to/:email | User: ${user.name} | responded with Attendance Not Found`
        );
        return res.status(404).json({ message: "Attendance Not Found" });
      }
    } catch (err) {
      logger.error(
        `${ip}: API /api/v1/attendance/get/from/:from/to/:to/:email | User: ${user.name} | responded with Error: ${err.message}`
      );
      return res.status(500).json({ error: "Error", message: err.message });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/attendance/get/from/:from/to/:to/:email | User: ${user.name} | responded with User is not Authorized`
    );
    return res.status(401).send({ message: "User is not Authorized" });
  }
};

//@desc Add record in AttendanceData
//@route POST /api/v1/attendance/add/record/:id
//@access Private: Needs Login
const addRecordInAttendanceData = async (req, res) => {
  const data = matchedData(req);
  const { id } = req.params;
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    try {
      const attendance = await Attendance.findOne({
        _id: id,
      });
      if (attendance) {
        attendance.AttendanceData.push({
          emp_id: data.emp_id,
          name: data.name,
          present: data.present,
        });
        await attendance.save();
        logger.info(
          `${ip}: API /api/v1/attendance/add/record/:id | User: ${user.name} | responnded with Success `
        );
        return res.status(200).json(attendance);
      } else {
        logger.error(
          `${ip}: API /api/v1/attendance/add/record/:id | User: ${user.name} | responnded with Attendance Not Found `
        );
        return res.status(404).json({ message: "Attendance Not Found" });
      }
    } catch (err) {
      logger.error(
        `${ip}: API /api/v1/attendance/add/record/:id | User: ${user.name} | responnded with Error `
      );
      return res.status(500).json({ error: "Error", message: err.message });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/attendance/add/record/:id | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Delete Attendance
//@route DELETE /api/v1/attendance/delete/:id
//@access Private: Needs Login
const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  const { deleteScope, month, year, client_user_id, month_year } = req.query;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    // Allow deleting an entire month's data for a client when query params are provided
    if (deleteScope === "month") {
      if (!client_user_id || !month || !year) {
        return res
          .status(400)
          .json({ message: "client_user_id, month and year are required to delete by month" });
      }

      // Normalize month/year inputs
      const periodMatch = String(month_year || "").match(/^(\d{4})-(\d{1,2})/);
      const monthNum = periodMatch ? Number(periodMatch[2]) : getMonthNumber(month);
      const yearNum = periodMatch ? Number(periodMatch[1]) : Number(year);
      if (!Number.isInteger(monthNum) || monthNum < 1 || monthNum > 12 || !Number.isInteger(yearNum)) {
        return res.status(400).json({ message: "Valid month and year are required" });
      }

      const isoPrefix = `${yearNum}-${String(monthNum).padStart(2, "0")}`;
      const monthQuery = {
        client_user_id,
        $expr: {
          $eq: [{ $dateToString: { format: "%Y-%m", date: "$month_year" } }, isoPrefix],
        },
      };

      const recordsToDelete = await Attendance.find(monthQuery).lean();
      if (!recordsToDelete || recordsToDelete.length === 0) {
        logger.info(
          `${ip}: API /api/v1/attendance/delete/${id}?month=${month}&year=${year} | Attendance not found`
        );
        return res.status(404).json({ message: "Attendance not found" });
      }

      const result = await Attendance.deleteMany(monthQuery);
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Attendance not found" });
      }
      const leaveRestore = await reconcileEmployeeLeaveBalances(client_user_id);

      logger.info(
        `${ip}: API /api/v1/attendance/delete/${id}?month=${month}&year=${year} | Attendance deleted successfully | count=${result.deletedCount} | restoredEmployees=${leaveRestore.employeesUpdated}`
      );
      return res
        .status(200)
        .json({
          message: "Attendance deleted successfully",
          deletedCount: result.deletedCount,
          leaveRestore,
        });
    }

    // Fallback: delete single record by _id
    const attendance = await Attendance.findById(id).lean();
    if (!attendance) {
      logger.info(`${ip}: API /api/v1/attendance/delete/${id} | Attendance not found`);
      return res.status(404).json({ message: "Attendance not found" });
    }

    const clientUserId = String(attendance.client_user_id);
    const deleted = await Attendance.findByIdAndDelete(id);
    if (!deleted) {
      logger.info(`${ip}: API /api/v1/attendance/delete/${id} | Attendance not found`);
      return res.status(404).json({ message: "Attendance not found" });
    }
    const leaveRestore = await reconcileEmployeeLeaveBalances(clientUserId);
    logger.info(`${ip}: API /api/v1/attendance/delete/${id} | Attendance deleted successfully`);
    return res.status(200).json({ message: "Attendance deleted successfully", leaveRestore });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/attendance/delete/${id} | Error: ${err.message}`);
    return res.status(500).json({ message: "Failed to delete attendance", error: err.message });
  }
};

const reconcileClientLeaveBalances = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "User is not authorized" });

  try {
    const leaveRestore = await reconcileEmployeeLeaveBalances(user._id);
    return res.status(200).json({
      message: "Leave balances recalculated from attendance records",
      leaveRestore,
    });
  } catch (err) {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    logger.error(`${ip}: Leave balance reconciliation failed: ${err.message}`);
    return res.status(500).json({ message: "Could not recalculate leave balances" });
  }
};

// GET /api/v1/attendance/client/:clientId?year=YYYY&month=MM|MMName&month_year=MM-YYYY
const getClientAttendance = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { year, month, month_year } = req.query;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // base match for client (support client_user_id or client)
    const baseOr = [{ client_user_id: clientId }, { client: clientId }];

    const query = { $or: baseOr };

    // if caller provided explicit month_year and it parses to a Date, use date-range query
    if (month_year) {
      // try parse common formats: YYYY-MM, MM-YYYY, full date
      let parsedDate = null;
      // if format like "MM-YYYY" -> convert to start of month
      const mmYYYY = /^(\d{2})-(\d{4})$/;
      const yyyyMM = /^(\d{4})-(\d{2})$/;
      if (mmYYYY.test(month_year)) {
        const [, mm, yyyy] = month_year.match(mmYYYY);
        parsedDate = new Date(Number(yyyy), Number(mm) - 1, 1);
      } else if (yyyyMM.test(month_year)) {
        const [, yyyy, mm] = month_year.match(yyyyMM);
        parsedDate = new Date(Number(yyyy), Number(mm) - 1, 1);
      } else {
        const d = new Date(month_year);
        if (!isNaN(d)) parsedDate = d;
      }

      if (parsedDate) {
        // build range for the month (start inclusive, next month exclusive)
        const start = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
        const end = new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 1);
        query.$and = query.$and || [];
        query.$and.push({ month_year: { $gte: start, $lt: end } });
      } else {
        // if cannot parse, still allow literal match (only if schema accepts string)
        query.month_year = month_year;
      }
    }

    // Year handling (try numeric and string)
    if (typeof year !== 'undefined' && year !== '') {
      const yNum = Number(year);
      query.$and = query.$and || [];
      query.$and.push({ $or: [{ year: yNum }, { year: String(year) }] });
    }

    // Month handling: do NOT attempt to match month_year with plain month strings (avoids Date cast)
    if (typeof month !== 'undefined' && month !== '') {
      const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
      ];

      const monthCandidates = new Set();
      const mNum = Number(month);
      if (!Number.isNaN(mNum) && mNum >= 1 && mNum <= 12) {
        monthCandidates.add(mNum); // numeric
        monthCandidates.add(String(mNum)); // string numeric
        monthCandidates.add(String(mNum).padStart(2, '0')); // padded
        monthCandidates.add(monthNames[mNum - 1]); // name
      } else {
        const mStr = String(month);
        monthCandidates.add(mStr);
        const idx = monthNames.findIndex(n => n.toLowerCase() === mStr.toLowerCase());
        if (idx !== -1) {
          monthCandidates.add(idx + 1);
          monthCandidates.add(String(idx + 1).padStart(2, '0'));
          monthCandidates.add(monthNames[idx]);
        }
      }

      const monthArray = Array.from(monthCandidates);
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { month: { $in: monthArray } },
          { month_name: { $in: monthArray } }
        ]
      });

      // Additionally, if year is provided and DB stores month_year as Date, add a date-range fallback
      if (year && !isNaN(Number(year)) && monthArray.length && !isNaN(Number(monthArray[0]))) {
        const mm = Number(monthArray[0]);
        if (mm >=1 && mm <=12) {
          const start = new Date(Number(year), mm - 1, 1);
          const end = new Date(Number(year), mm, 1);
          query.$and.push({ month_year: { $gte: start, $lt: end } });
        }
      }
    }

    // Query DB
    const attendanceRecords = await Attendance.find(query);

    console.info(`${ip}: getClientAttendance client=${clientId} query=`, query, 'found=', attendanceRecords.length);

    return res.json({ data: attendanceRecords });
  } catch (err) {
    console.error('getClientAttendance error:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  testAttendanceAPI,
  addAttendance,
  addSingleAttendance,
  getAllAttendanceByClient,
  getAttendanceById,
  getLatestAttendance,
  editAttendanceData,
  addRecordInAttendanceData,
  getEmployeeAttendance,
  getAttendaceFromTo2,
  deleteAttendance,
  reconcileClientLeaveBalances,
  getClientAttendance,
};
