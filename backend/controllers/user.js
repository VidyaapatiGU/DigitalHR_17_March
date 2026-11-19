const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Admin = require("../models/Admin");
const logger = require("../config/logger.js");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");
const StoredDocument = require("../models/StoredDocument");
const Role = require("../models/Role");
const Department = require("../models/Department");
const Team = require("../models/Team");

const secret = process.env.ACCESS_TOKEN_SECERT;

const omitPassword = (record) => {
  if (!record) return record;
  const safeRecord = typeof record.toObject === "function" ? record.toObject() : { ...record };
  delete safeRecord.password;
  return safeRecord;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeUploadValue = (value) =>
  value === undefined || value === null ? "" : String(value).trim();

const deleteUserAndRelatedData = async (userRecord) => {
  const userId = userRecord._id;
  const roleId = userRecord.roleType?._id || userRecord.roleType;
  const role = userRecord.roleType?.name
    ? userRecord.roleType
    : roleId
      ? await Role.findById(roleId).select("name").lean()
      : null;
  const roleName = String(role?.name || "").trim().toLowerCase();
  const employeeQueries = [{ client_user_id: userId }];

  // Employee login accounts are linked to their own Employee record by user_id.
  if (roleName === "employee") {
    employeeQueries.push({ user_id: userId });
  } else {
    const accountIdentity = [
      ...(userRecord.email ? [{ email: userRecord.email }] : []),
      ...(userRecord.adhar_card !== undefined ? [{ adhar_card: userRecord.adhar_card }] : []),
    ];
    if (accountIdentity.length) {
      employeeQueries.push({ user_id: userId, $or: accountIdentity });
    }
  }

  const linkedEmployees = await Employee.find({ $or: employeeQueries })
    .select("_id emp_no client_user_id")
    .lean();
  const attendanceQueries = [{ client_user_id: userId }];
  linkedEmployees.forEach((employee) => {
    if (employee.emp_no && employee.client_user_id) {
      attendanceQueries.push({
        client_user_id: employee.client_user_id,
        emp_no: employee.emp_no,
      });
    }
  });

  const attendanceDelete = await Attendance.deleteMany({ $or: attendanceQueries });
  if (linkedEmployees.length) {
    await Employee.deleteMany({ _id: { $in: linkedEmployees.map((employee) => employee._id) } });
  }

  const documentEntityIds = [String(userId), ...linkedEmployees.map((employee) => String(employee._id))];
  const documentDelete = await StoredDocument.deleteMany({ entityId: { $in: documentEntityIds } });
  const notificationDelete = await Notification.deleteMany({ to_user: userId });
  // Keep notifications other people received, but remove the deleted user's attribution.
  await Notification.updateMany({ by_user: userId }, { $unset: { by_user: "" } });
  await User.findByIdAndDelete(userId);

  return {
    employees: linkedEmployees.length,
    attendance: attendanceDelete.deletedCount || 0,
    documents: documentDelete.deletedCount || 0,
    notifications: notificationDelete.deletedCount || 0,
  };
};

//@desc Test User API
//@route GET /api/v1/user
//@access Private: Needs Login
const testUserAPI = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/user | User:  ${user.name}| responnded with "User API Test Successfully" `
    );
    return res.status(200).send("User API Test Successfully");
  } else {
    logger.error(
      `${ip}: API /api/v1/user | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Create New User
//@route POST /api/v1/user/add
//@access Private: Needs Login
const createUser = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user || "user";

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/user/add | User: ${user.name} | responnded with Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    const data = matchedData(req);
    const username = data.username.trim().toLowerCase();

    const linkedClient = await Client.findOne({
      _id: data.client_id,
      active: { $ne: false },
      deletedAt: null,
    }).select("_id");
    if (!linkedClient) {
      return res.status(400).json({ message: "Select an active client" });
    }

    const oldUser = await User.findOne({
      $or: [
        { email: data.email },
        { username },
        { adhar_card: Number(data.adhar_card) },
      ],
    });
    if (oldUser) {
      logger.error(
        `${ip}: API /api/v1/user/add | User: ${user.name} | responded with duplicate user identity`
      );
      return res.status(409).json({ message: "Username, email, or Aadhaar number is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const securedPass = await bcrypt.hash(data.password, salt);
    await User.create({
      username,
      name: data.name,
      email: data.email,
      whatsapp_no: data.whatsapp_no,
      password: securedPass,
      adhar_card: data.adhar_card,
      roleType: data.roleType,
      team: data.team,
      department: data.department,
      client_id: linkedClient._id,
      designation: data.designation,
      city: data.city,
      state: data.state,
      country: data.country,
      address: data.address,
      pin_code: data.pin_code,
    })
      .then((createdUser) => {
        logger.info(
          `${ip}: API /api/v1/user/add | User: ${createdUser.name} | responded with Success `
        );
        const userResponse = createdUser.toObject();
        delete userResponse.password;
        return res.status(201).json({ data: userResponse, message: "User created successfully" });
      })
      .catch((err) => {
        logger.error(
          `${ip}: API /api/v1/user/add | User: ${user.name} | responnded with Error `
        );
        if (err.code === 11000) {
          return res.status(409).json({ message: "Username, email, or Aadhaar number is already registered" });
        }
        return res.status(500).json({ error: "Error", message: err.message });
      });
  } else {
    logger.error(
      `${ip}: API /api/v1/user/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Bulk create Users from an Excel upload
//@route POST /api/v1/user/upload
//@access Private: Admin
const uploadUsers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const loggedInUser = req.user;
  if (!loggedInUser) {
    return res.status(401).json({ message: "User is not authorized" });
  }
  if (!["admin", "super_admin"].includes(loggedInUser.roleType?.name)) {
    return res.status(403).json({ message: "Admin access is required to upload users" });
  }

  const userData = req.body.userData;
  const created = [];
  const failed = [];
  const seenUsernames = new Set();
  const seenEmails = new Set();
  const seenAadhaar = new Set();

  try {
    const [clients, roles, departments, teams] = await Promise.all([
      Client.find({ active: { $ne: false }, deletedAt: null }).select("_id name client_code").lean(),
      Role.find({ active: { $ne: false } }).select("_id name").lean(),
      Department.find({ active: { $ne: false } }).select("_id name").lean(),
      Team.find({ active: { $ne: false } }).select("_id name").lean(),
    ]);

    const findNamedRecord = (records, value) => {
      const normalized = normalizeUploadValue(value).toLowerCase();
      return records.find((record) => String(record.name || "").trim().toLowerCase() === normalized);
    };

    for (let index = 0; index < userData.length; index += 1) {
      const row = userData[index] || {};
      const rowNumber = Number(row._excelRow) || index + 2;
      const name = normalizeUploadValue(row.name);
      const username = normalizeUploadValue(row.username).toLowerCase();
      const email = normalizeUploadValue(row.email).toLowerCase();
      const password = normalizeUploadValue(row.password);
      const aadhaar = normalizeUploadValue(row.adhar_card || row.aadhaar);
      const whatsapp = normalizeUploadValue(row.whatsapp_no || row.phone_number);
      const address = normalizeUploadValue(row.address);
      const city = normalizeUploadValue(row.city);
      const state = normalizeUploadValue(row.state);
      const country = normalizeUploadValue(row.country);
      const pinCode = normalizeUploadValue(row.pin_code || row.pincode);
      const designation = normalizeUploadValue(row.designation || row.job_title);
      const roleName = normalizeUploadValue(row.role || row.role_name || row.role_type);
      const departmentName = normalizeUploadValue(row.department || row.department_name);
      const teamName = normalizeUploadValue(row.team || row.team_name);
      const clientReference = normalizeUploadValue(row.client_code || row.client || row.client_name);

      let message = "";
      if (name.length < 3) message = "Name must be at least 3 characters";
      else if (username.length < 3 || username.length > 50) message = "Username must be 3 to 50 characters";
      else if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) message = "A valid email is required";
      else if (password.length < 5) message = "Password must be at least 5 characters";
      else if (!/^\d{12}$/.test(aadhaar)) message = "Aadhaar number must contain 12 digits";
      else if (!/^\d+$/.test(whatsapp)) message = "WhatsApp number must contain digits only";
      else if (!address || !city || !state || !country) message = "Address, city, state, and country are required";
      else if (!/^\d+$/.test(pinCode)) message = "Pin code must contain digits only";
      else if (!designation) message = "Job title is required";
      else if (!clientReference) message = "Client code is required";
      else if (!roleName || !departmentName || !teamName) message = "Role, department, and team are required";

      if (message) {
        failed.push({ rowNumber, name, message });
        continue;
      }

      const clientCodeMatch = clients.find(
        (client) => String(client.client_code || "").toLowerCase() === clientReference.toLowerCase()
      );
      const clientNameMatches = clients.filter(
        (client) => String(client.name || "").trim().toLowerCase() === clientReference.toLowerCase()
      );
      const client = clientCodeMatch || (clientNameMatches.length === 1 ? clientNameMatches[0] : null);
      if (!client) {
        failed.push({ rowNumber, name, message: "Client code does not match an active client" });
        continue;
      }

      const role = findNamedRecord(roles, roleName);
      const department = findNamedRecord(departments, departmentName);
      const team = findNamedRecord(teams, teamName);
      if (!role || !department || !team) {
        const missing = [
          !role && "role",
          !department && "department",
          !team && "team",
        ].filter(Boolean);
        failed.push({ rowNumber, name, message: `Active ${missing.join(", ")} name not found` });
        continue;
      }

      const normalizedAadhaar = String(Number(aadhaar));
      if (
        seenUsernames.has(username) ||
        seenEmails.has(email) ||
        seenAadhaar.has(normalizedAadhaar)
      ) {
        failed.push({ rowNumber, name, message: "Username, email, or Aadhaar number appears more than once in this workbook" });
        continue;
      }

      try {
        const emailPattern = new RegExp(`^${escapeRegex(email)}$`, "i");
        const usernamePattern = new RegExp(`^${escapeRegex(username)}$`, "i");
        const matchingUsers = await User.find({
          $or: [
            { email: emailPattern },
            { username: usernamePattern },
            { adhar_card: Number(aadhaar) },
          ],
        }).select("username email adhar_card active roleType");
        const activeMatches = matchingUsers.filter((user) => user.active !== false);
        if (activeMatches.length) {
          const duplicateFields = [];
          if (activeMatches.some((user) => String(user.username || "").trim().toLowerCase() === username)) {
            duplicateFields.push("username");
          }
          if (activeMatches.some((user) => String(user.email || "").trim().toLowerCase() === email)) {
            duplicateFields.push("email");
          }
          if (activeMatches.some((user) => Number(user.adhar_card) === Number(aadhaar))) {
            duplicateFields.push("Aadhaar number");
          }
          failed.push({
            rowNumber,
            name,
            message: `Already registered: ${duplicateFields.join(", ") || "username, email, or Aadhaar number"}`,
          });
          continue;
        }

        const inactiveMatches = matchingUsers.filter((user) => user.active === false);
        if (inactiveMatches.length > 1) {
          failed.push({
            rowNumber,
            name,
            message: "This row matches multiple deleted accounts. Review the username, email, and Aadhaar number.",
          });
          continue;
        }

        if (inactiveMatches.length === 1) {
          await deleteUserAndRelatedData(inactiveMatches[0]);
        }

        const securedPassword = await bcrypt.hash(password, 10);
        const userFields = {
          username,
          name,
          email,
          password: securedPassword,
          adhar_card: Number(aadhaar),
          whatsapp_no: Number(whatsapp),
          address,
          city,
          state,
          country,
          pin_code: pinCode,
          designation,
          client_id: client._id,
          roleType: role._id,
          department: department._id,
          team: team._id,
          active: true,
          approved: true,
        };
        const savedUser = await User.create(userFields);

        seenUsernames.add(username);
        seenEmails.add(email);
        seenAadhaar.add(normalizedAadhaar);
        created.push({
          id: String(savedUser._id),
          rowNumber,
          name: savedUser.name,
          username: savedUser.username,
          email: savedUser.email,
          client: client.name,
        });
      } catch (error) {
        logger.error(`API /api/v1/user/upload | Row ${rowNumber} failed: ${error.message}`);
        failed.push({
          rowNumber,
          name,
          message: error.code === 11000
            ? "Username, email, or Aadhaar number is already registered"
            : "Unable to create this user row",
        });
      }
    }

    const statusCode = failed.length ? 207 : 201;
    return res.status(statusCode).json({
      created,
      failed,
      message: `${created.length} user(s) created${failed.length ? `; ${failed.length} row(s) failed` : ""}`,
    });
  } catch (error) {
    logger.error(`API /api/v1/user/upload | User: ${loggedInUser.name} | ${error.message}`);
    return res.status(500).json({ message: "Bulk upload failed" });
  }
};

//@desc Get all Users
//@route GET /api/v1/user/getall
//@access Private: Needs Login
const getUsers = async (req, res) => {
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    if (user) {
      const users = await User.find({
        active: true,
      })
        .populate("department")
        .populate("roleType")
        .populate("team")
        .populate({ path: "client_id", select: "name client_code email" });
      logger.info(
        `${ip}: API /api/v1/user/getall | User: ${user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: users.map(omitPassword),
        message: "User retrived successfully",
      });
    } else {
      logger.error(
        `${ip}: API /api/v1/user/getall | User: ${user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/user/getall | User: ${user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Get User with id
//@route GET /api/v1/user/get/:id
//@access Private: Needs Login
const getUser = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    if (loggedin_user) {
      const { id } = req.params;
      const user = await User.find({
        _id: id,
      })
        .populate("department")
        .populate("roleType")
        .populate("team")
        .populate({ path: "client_id", select: "name client_code email" });
      if (user.length > 0) {
        logger.info(
          `${ip}: API /api/v1/user/get/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return await res.status(200).json({
          data: user.map(omitPassword),
          message: "User retrived successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/user/get/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. User was not found `
        );
        return await res.status(200).json({
          message: "User Not Found",
        });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/user/get/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/user/get/:id | User: ${loggedin_user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Update User with id
//@route PUT /api/v1/user/update/:id
//@access Private: Needs Login
const updateUser = async (req, res) => {
  const loggedin_user = req.user;
  const { id } = req.params;
  const { name, email, whatsapp_no, roleType, department, team, profile_url, client_id, designation } = req.body;

  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/user/update/:${id} | User: ${loggedin_user.name} | responnded with Validation Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  if (loggedin_user) {
    try {
      const isAdmin = ["admin", "super_admin"].includes(loggedin_user.roleType?.name);
      const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : email;
      if (email !== undefined && !isAdmin) {
        return res.status(403).json({ message: "Only admins can change account email" });
      }
      if (email !== undefined) {
        const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const emailPattern = new RegExp(`^${escapedEmail}$`, "i");
        const [existingUser, existingAdmin] = await Promise.all([
          User.findOne({ email: emailPattern, _id: { $ne: id } }),
          Admin.findOne({ email: emailPattern, _id: { $ne: id } }),
        ]);
        if (existingUser || existingAdmin) {
          return res.status(409).json({ message: "This email is already in use" });
        }
      }

      const updatedUser = {};
      if (client_id !== undefined) {
        const linkedClient = await Client.findOne({
          _id: client_id,
          active: { $ne: false },
          deletedAt: null,
        }).select("_id");
        if (!linkedClient) {
          return res.status(400).json({ message: "Select an active client" });
        }
        updatedUser.client_id = linkedClient._id;
      }
      if (name !== undefined) updatedUser.name = name;
      if (email !== undefined) updatedUser.email = normalizedEmail;
      if (whatsapp_no !== undefined) updatedUser.whatsapp_no = whatsapp_no;
      if (roleType !== undefined) updatedUser.roleType = roleType;
      if (department !== undefined) updatedUser.department = department;
      if (team !== undefined) updatedUser.team = team;
      if (designation !== undefined) updatedUser.designation = designation;
      if (profile_url) updatedUser.profile_url = profile_url;

      let oldUser = await User.findOne({ _id: id });
      if (oldUser) {
        const result = await User.findByIdAndUpdate(id, updatedUser, {
          new: true,
        })
          .populate("department")
          .populate("roleType")
          .populate("team")
          .populate({ path: "client_id", select: "name client_code email" });

        if (result.roleType.name === "client") {
          await Client.findOneAndUpdate(
            { user_id: id },
            {
              name: result.name,
              email: result.email,
              whatsapp_no: result.whatsapp_no,
              address: result.address,
              city: result.city,
              state: result.state,
              country: result.country,
              pincode: result.pincode,
            }
          );
        }

        logger.info(
          `${ip}: API /api/v1/user/update/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: omitPassword(result), message: "User Updated Successfully" });
      } else {
        // attempt updating Admin document
        const admin = await Admin.findById(id);
        if (admin) {
          if (name !== undefined) admin.name = name;
          if (email !== undefined) admin.email = normalizedEmail;
          if (whatsapp_no !== undefined) admin.whatsapp_no = whatsapp_no;
          if (profile_url) admin.profile_url = profile_url;
          await admin.save();
          logger.info(
            `${ip}: API /api/v1/user/update/:${id} | Admin updated successfully`
          );
          return res
            .status(200)
            .json({ data: omitPassword(admin), message: "User Updated Successfully" });
        }

        // attempt updating Client document
        const client = await Client.findById(id);
        if (client) {
          if (name !== undefined) client.name = name;
          if (email !== undefined) client.email = normalizedEmail;
          if (whatsapp_no !== undefined) client.whatsapp_no = whatsapp_no;
          if (profile_url) client.profile_url = profile_url;
          if (req.body.address !== undefined) client.address = req.body.address;
          if (req.body.city !== undefined) client.city = req.body.city;
          if (req.body.state !== undefined) client.state = req.body.state;
          if (req.body.country !== undefined) client.country = req.body.country;
          if (req.body.pin_code !== undefined) client.pin_code = req.body.pin_code;

          await client.save();
          logger.info(
            `${ip}: API /api/v1/user/update/:${id} | Client updated successfully`
          );
          return res
            .status(200)
            .json({ data: omitPassword(client), message: "User Updated Successfully" });
        }

        logger.info(
          `${ip}: API /api/v1/user/update/:${id} | User: ${loggedin_user.name} | responnded with User Not Found `
        );
        return res.status(200).json({ message: "User Not Found" });
      }
    } catch (error) {
      logger.error(
        `${ip}: API /api/v1/user/update/:${id} | User: ${loggedin_user.name} | responnded with Error `
      );
      return res
        .status(500)
        .json({ data: error, message: "Something went wrong" });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/user/update/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Permanently delete User and data directly linked to the account
//@route PUT /api/v1/user/delete/:id
//@access Private: Needs Login
const deleteUser = async (req, res) => {
  const loggedin_user = req.user;
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    if (!loggedin_user) {
      return res.status(401).json({ message: "User is not authorized" });
    }

    if (!["admin", "super_admin"].includes(loggedin_user.roleType?.name)) {
      return res.status(403).json({ message: "Admin access is required to delete users" });
    }

    const userToDelete = await User.findById(id)
      .populate("department")
      .populate("roleType")
      .populate("team")
      .populate({ path: "client_id", select: "name client_code email" });

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedData = await deleteUserAndRelatedData(userToDelete);

    logger.info(
      `${ip}: API /api/v1/user/delete/:${id} | User: ${loggedin_user.name} | permanently deleted account, ${deletedData.employees} linked employee record(s), ${deletedData.attendance} attendance row(s), ${deletedData.documents} document(s), and ${deletedData.notifications} notification(s)`
    );
    return res.status(200).json({ message: "User and linked data deleted successfully" });
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/user/delete/:${id} | User: ${loggedin_user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc User Login with email and password
//@route POST /api/v1/user/login/
//@access PUBLIC
const logIn = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/user/login responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);

  const loginId = data.email || data.username;
  const password = data.password;

  if (!loginId || !password) {
    return res.status(400).json({ message: "Email/Username and password are required" });
  }

  try {
    let oldUser = await User.findOne({
      $or: [{ email: loginId }, { username: loginId }],
    })
      .populate("department")
      .populate("roleType")
      .populate("team")
      .populate({ path: "client_id", select: "name client_code email" });

    if (!oldUser) {
      // Try Admin collection fallback
      const admin = await Admin.findOne({
        $or: [{ email: loginId }, { username: loginId }],
      });

      if (!admin) {
        logger.error(
          `${ip}: API /api/v1/user/login responnded with User Not Found for the user: ${loginId}`
        );
        return res.status(404).json({ message: "User Not Found, Please Signup" });
      }

      if (!admin.active) {
        logger.error(
          `${ip}: API /api/v1/user/login responnded with User Deleted for the user: ${loginId}`
        );
        return res.status(404).json({ message: "User Deleted" });
      }

      const isPasswordCorrectAdmin = await bcrypt.compare(password, admin.password);

      if (!isPasswordCorrectAdmin) {
        logger.error(
          `${ip}: API /api/v1/user/login responnded with Incorrect Password for the user: ${loginId}`
        );
        return res
          .status(401)
          .json({ status: 401, message: "Incorrect Password" });
      }

      const adminUserShape = {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        theme: admin.theme || "ocean",
        roleType: { name: admin.role },
        active: admin.active,
        approved: true,
      };

      const token = jwt.sign({ user: adminUserShape }, secret, {
        expiresIn: "48hr",
      });

      logger.info(
        `${ip}: API /api/v1/user/login responnded with Login Successfull for the admin: ${loginId}`
      );
      return res
        .status(200)
        .json({ data: adminUserShape, token, message: "Login Successfull" });
    }

    if (!oldUser.active) {
      logger.error(
        `${ip}: API /api/v1/user/login responnded with User Deleted for the user: ${loginId}`
      );
      return res.status(404).json({ message: "User Deleted" });
    }

    if (!oldUser.approved) {
      logger.error(
        `${ip}: API /api/v1/user/login responnded with user Disabled: ${loginId}`
      );
      return res.status(402).json({ status: 402, message: "User Disabled" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      logger.error(
        `${ip}: API /api/v1/user/login responnded with Incorrect Password for the user: ${loginId}`
      );
      return res
        .status(401)
        .json({ status: 401, message: "Incorrect Password" });
    }

    // Keep JWT compact; only store essentials needed for auth
    const tokenPayload = {
      _id: oldUser._id,
      username: oldUser.username,
      email: oldUser.email,
      roleType: oldUser.roleType,
      active: oldUser.active,
      approved: oldUser.approved,
      client_id: oldUser.client_id?._id || oldUser.client_id,
    };

    const token = jwt.sign({ user: tokenPayload }, secret, {
      expiresIn: "48hr",
    });
    //console.log(token);
    logger.info(
      `${ip}: API /api/v1/user/login responnded with Login Successfull for the user: ${loginId}`
    );
    const userResponse = oldUser.toObject();
    delete userResponse.password;
    return res
      .status(200)
      .json({ data: userResponse, token, message: "Login Successfull" });
  } catch (error) {
    logger.info(`${ip}: API /api/v1/user/login responnded with error`);
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Get current Logged in USer
//@route POST /api/v1/user/getCurrent/
//@access Private Needs Login
const getCurrent = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    //console.log("GetCurrent");
    const user = await User.find({
      _id: req.user._id,
    })
      .populate("department")
      .populate("roleType")
      .populate("team")
      .populate({ path: "client_id", select: "name client_code email" });
    //console.log(user);
    if (user.length > 0) {
      logger.info(
        `${ip}: API /api/v1/user/getCurrent/:${req.user._id}  responnded with Success `
      );
      return await res.status(200).json({
          user: omitPassword(user[0]),
      });
    } else {
      const client = await Client.find({
        _id: req.user._id,
      })
        .populate('notificationDepartment', 'name')
        .populate('notificationRole', 'name')
        .populate({
          path: 'user_id',
          select: 'department team roleType',
          populate: [
            { path: 'department', select: 'name' },
            { path: 'team', select: 'name' },
            { path: 'roleType', select: 'name' },
          ],
        });
      //console.log(client);
      if (client.length > 0) {
        logger.info(
          `${ip}: API /api/v1/client/getCurrent/:${req.user._id}  responnded with Success `
        );
        return await res.status(200).json({
          user: omitPassword(client[0]),
        });
      } else {
        const emp = await Employee.find({
          _id: req.user._id,
        });
        if (emp.length > 0) {
          logger.info(
            `${ip}: API /api/v1/client/getCurrent/:${req.user._id}  responnded with Success `
          );
          return await res.status(200).json({
            user: omitPassword(emp[0]),
          });
        }
      }

      // Check Admin collection for auth tokens issued to Admin model users
      const admin = await Admin.find({ _id: req.user._id });
      if (admin.length > 0) {
        const adminObj = omitPassword(admin[0]);
        adminObj.roleType = { name: adminObj.role || "admin" };
        logger.info(
          `${ip}: API /api/v1/admin/getCurrent/:${req.user._id}  responnded with Success `
        );
        return await res.status(200).json({
          user: adminObj,
        });
      }
    }

    return res.status(404).json({ message: "User Not Found" });
  } catch (error) {
    console.log(error);
    logger.info(`${ip}: API /api/v1/user/getCurrent responnded with the Error`);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Update User approved with id (we are updating active to false )
//@route PUT /api/v1/user/app_dis/:id
//@access Private: Needs Login
const AppDisUser = async (req, res) => {
  const loggedin_user = req.user;
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    if (loggedin_user) {
      const oldUser = await User.findOne({ _id: id });

      if (oldUser) {
        if (oldUser.approved) {
          const updatedUser = {
            approved: false,
          };
          const result = await User.findByIdAndUpdate(id, updatedUser, {
            new: true,
          })
            .populate("department")
            .populate("roleType")
            .populate("team");

          logger.info(
            `${ip}: API /api/v1/user/app_dis/:${id} | User: ${loggedin_user.name} | responnded with Success `
          );
          return res.status(200).json({
            data: omitPassword(result),
            message: "User Approved/Disapproved Successfully",
          });
        } else {
          const updatedUser = {
            approved: true,
          };
          const result = await User.findByIdAndUpdate(id, updatedUser, {
            new: true,
          });

          logger.info(
            `${ip}: API /api/v1/user/app_dis/:${id} | User: ${loggedin_user.name} | responnded with Success `
          );
          return res.status(200).json({
            data: omitPassword(result),
            message: "User Approved/Disapproved Successfully",
          });
        }
      } else {
        logger.info(
          `${ip}: API /api/v1/user/app_dis/:${id} | User: ${loggedin_user.name} | responnded with User Not Found `
        );
        return res.status(200).json({ message: "User Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/user/app_dis/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/user/app_dis/:${id} | User: ${loggedin_user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Change password of User with id
//@route PUT /api/v1/user/change/pass/:id
//@access Private: Needs Login
const changePass = async (req, res) => {
  const loggedin_user = req.user;
  const { id } = req.params;
  const { password } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/user/change/pass/:${id} | User: ${loggedin_user.name} | responnded with Validation Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (loggedin_user) {
      const oldUser = await User.findOne({ _id: id });
      const salt = await bcrypt.genSalt(10);
      const securedPass = await bcrypt.hash(password, salt);
      if (oldUser) {
        const updatedUser = {
          password: securedPass,
        };
        const result = await User.findByIdAndUpdate(id, updatedUser, {
          new: true,
        })
          .populate("department")
          .populate("roleType")
          .populate("team");
        logger.info(
          `${ip}: API /api/v1/user/change/pass/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return res.status(200).json({
          data: omitPassword(result),
          message: "User Password Changed Successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/user/change/pass/:${id} | User: ${loggedin_user.name} | responnded with User Not Found `
        );
        return res.status(404).json({ message: "User Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/user/change/pass/:${id} | User: ${loggedin_user.name} | responnded with User is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/user/change/pass/:${id} | User: ${loggedin_user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

// Persist a theme only for the account authenticated by this request.
const updateTheme = async (req, res) => {
  const accountId = req.user?._id;
  const roleName = String(req.user?.roleType?.name || "").trim().toLowerCase();
  const theme = String(req.body?.theme || "").trim().toLowerCase();
  const supportedThemes = ["ocean", "forest", "plum"];

  if (!accountId) {
    return res.status(401).json({ message: "User is not authorized" });
  }
  if (!supportedThemes.includes(theme)) {
    return res.status(400).json({ message: "Select a supported theme" });
  }

  try {
    let account = null;
    if (["admin", "super_admin"].includes(roleName)) {
      account = await Admin.findById(accountId);
      if (!account) account = await User.findById(accountId);
    } else if (roleName === "client") {
      account = await Client.findById(accountId);
      if (!account) account = await User.findById(accountId);
    } else if (roleName === "employee") {
      account = await Employee.findById(accountId);
      if (!account) account = await User.findById(accountId);
    } else {
      account = await User.findById(accountId);
    }

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    account.theme = theme;
    await account.save();
    return res.status(200).json({ theme: account.theme, message: "Theme saved" });
  } catch (error) {
    logger.error(`Failed to save account theme: ${error.message}`);
    return res.status(500).json({ message: "Unable to save theme" });
  }
};

module.exports = {
  testUserAPI,
  createUser,
  uploadUsers,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  logIn,
  getCurrent,
  AppDisUser,
  changePass,
  updateTheme,
};
