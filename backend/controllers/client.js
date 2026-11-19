const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const ClientSequence = require("../models/ClientSequence");
const StoredDocument = require("../models/StoredDocument");
const logger = require("../config/logger.js");

const secret = process.env.ACCESS_TOKEN_SECERT;

const omitPassword = (record) => {
  if (!record) return record;
  const safeRecord = typeof record.toObject === "function" ? record.toObject() : { ...record };
  delete safeRecord.password;
  return safeRecord;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const reserveNextSequence = async (counterId, highestExistingSequence = 0) => {
  const synchronizeCounter = () =>
    ClientSequence.updateOne(
      { _id: counterId },
      { $max: { sequence: highestExistingSequence } },
      { upsert: true }
    );

  try {
    await synchronizeCounter();
  } catch (error) {
    // A concurrent request may create the counter document first.
    if (error.code !== 11000) throw error;
    await ClientSequence.updateOne(
      { _id: counterId },
      { $max: { sequence: highestExistingSequence } }
    );
  }

  const reserved = await ClientSequence.findOneAndUpdate(
    { _id: counterId },
    { $inc: { sequence: 1 } },
    { new: true }
  );
  if (!reserved) throw new Error("Unable to reserve a client sequence");
  return reserved.sequence;
};

const getNextClientIdentity = async (usernamePrefix) => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const codePrefix = `DHR-${year}-${month}-`;
  const codePattern = new RegExp(`^${escapeRegex(codePrefix)}(\\d+)$`);
  const existingCodes = await Client.find(
    { client_code: { $regex: codePattern } },
    { client_code: 1, _id: 0 }
  ).lean();
  const highestCodeSequence = existingCodes.reduce((highest, client) => {
    const match = String(client.client_code || "").match(codePattern);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  const codeSequence = await reserveNextSequence(
    `client:${year}-${month}`,
    highestCodeSequence
  );
  const clientCode = `${codePrefix}${String(codeSequence).padStart(4, "0")}`;

  const normalizedUsernamePrefix = String(usernamePrefix || "CL").trim().replace(/\s+/g, "") || "CL";
  const escapedUsernamePrefix = escapeRegex(normalizedUsernamePrefix);
  const usernamePattern = new RegExp(`^${escapedUsernamePrefix}(\\d+)$`);
  const existingUsernames = await Client.find(
    { username: { $regex: usernamePattern } },
    { username: 1, _id: 0 }
  ).lean();
  const highestUsernameSequence = existingUsernames.reduce((highest, client) => {
    const match = String(client.username || "").match(usernamePattern);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  const usernameCounterId = `username:${normalizedUsernamePrefix.toLowerCase()}`;

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const usernameSequence = await reserveNextSequence(
      usernameCounterId,
      highestUsernameSequence
    );
    const username = `${normalizedUsernamePrefix}${usernameSequence}`;
    // Check all records, including soft-deleted ones, so a username is never reused.
    if (!(await Client.exists({ username }))) return { username, clientCode };
  }

  throw new Error("Unable to reserve a unique client username");
};

//@desc Test Client API
//@route GET /api/v1/client
//@access Private: Needs Login
const testClientAPI = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/client | User:  ${user.name}| responnded with "Client API Test Successfully" `
    );
    return res.status(200).send("Client API Test Successfully");
  } else {
    logger.error(
      `${ip}: API /api/v1/client | User: ${user.name} | responnded with Client is not Autherized `
    );
    return res.status(401).send({ message: "Client is not Autherized" });
  }
};

//@desc Create New Client
//@route POST /api/v1/client/add
//@access Private: Needs Login
const createClient = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/client/add | User: ${
        user?.name || "Guest"
      } | Responded with Error`
    );
    return res.status(400).json({ errors: errors.array() });
  }

  if (!user) {
    logger.error(
      `${ip}: API /api/v1/client/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }

  try {
    const identity = await getNextClientIdentity(data.username_prefix || "CL");

    const salt = await bcrypt.genSalt(10);
    const securedPass = await bcrypt.hash(data.password, salt);

    const newClient = await Client.create({
      client_code: identity.clientCode,
      username: identity.username,
      password: securedPass,
      name: data.name,
      email: data.email,
      whatsapp_no: data.whatsapp_no,
      city: data.city,
      address: data.address,
      country: data.country,
      state: data.state,
      pin_code: data.pin_code,
    });

    logger.info(
      `${ip}: API /api/v1/client/add | User: ${user.name} | Responded with Success`
    );
    return res.status(201).json(omitPassword(newClient));
  } catch (err) {
    logger.error(
      `${ip}: API /api/v1/client/add | User: ${
        user?.name || "Guest"
      } | Responded with Error`
    );
    console.log(err);
    return res.status(500).json({ error: "Error", message: err.message });
  }
};

const uploadClient = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (!user) {
    return res.status(401).json({ message: "User is not authorized" });
  }
  if (!["admin", "super_admin"].includes(user.roleType?.name)) {
    return res.status(403).json({ message: "Admin access is required to upload clients" });
  }

  const created = [];
  const failed = [];
  const seenEmails = new Set();
  const optionalString = (value) => {
    if (value === undefined || value === null) return undefined;
    const normalized = String(value).trim();
    return normalized || undefined;
  };
  const optionalBoolean = (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value === "boolean") return value;
    const normalized = String(value).trim().toLowerCase();
    if (["yes", "true", "1", "on"].includes(normalized)) return true;
    if (["no", "false", "0", "off"].includes(normalized)) return false;
    return undefined;
  };

  for (let index = 0; index < data.clientData.length; index += 1) {
    const row = data.clientData[index] || {};
    const name = optionalString(row.name);
    const password = optionalString(row.password);
    const rowNumber = Number(row._excelRow) || index + 2;
    if (!name || !password || password.length < 5) {
      failed.push({
        rowNumber,
        name,
        message: !name ? "Name is required" : "Password must be at least 5 characters",
      });
      continue;
    }

    const email = optionalString(row.email)?.toLowerCase();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      failed.push({ rowNumber, name, message: "Company email is not valid" });
      continue;
    }
    if (email && seenEmails.has(email)) {
      failed.push({ rowNumber, name, message: "Company email appears more than once in this workbook" });
      continue;
    }
    if (email) seenEmails.add(email);

    try {
      if (email && await Client.exists({ email, active: { $ne: false } })) {
        failed.push({ rowNumber, name, message: "Company email is already used by a client" });
        continue;
      }

      const usernamePrefix = optionalString(row.username_prefix) || "CL";
      const identity = await getNextClientIdentity(usernamePrefix);
      const salt = await bcrypt.genSalt(10);
      const securedPass = await bcrypt.hash(password, salt);
      const newClient = await Client.create({
        client_code: identity.clientCode,
        username: identity.username,
        password: securedPass,
        name,
        email,
        whatsapp_no: optionalString(row.whatsapp_no),
        city: optionalString(row.city),
        address: optionalString(row.address),
        country: optionalString(row.country),
        state: optionalString(row.state),
        pin_code: optionalString(row.pin_code),
        pf_enable: optionalBoolean(row.pf_enable),
        esic_enable: optionalBoolean(row.esic_enable),
        pan_card: optionalString(row.pan_card),
        adhar_card: optionalString(row.adhar_card),
        gst_no: optionalString(row.gst_no),
        cin_no: optionalString(row.cin_no),
        industry_type: optionalString(row.industry_type),
        employee_count_range: optionalString(row.employee_count_range),
        incorporation_type: optionalString(row.incorporation_type),
        contact_person: {
          name: optionalString(row.contact_name),
          email: optionalString(row.contact_email),
          contact_no: optionalString(row.contact_number),
          designation: optionalString(row.contact_designation),
        },
      });

      created.push({
        id: String(newClient._id),
        rowNumber,
        name: newClient.name,
        email: newClient.email || "",
        username: newClient.username,
        client_code: newClient.client_code,
      });
    } catch (error) {
      logger.error(
        `${ip}: API /api/v1/client/upload | Row ${rowNumber} failed: ${error.message}`
      );
      failed.push({ rowNumber, name, message: "Unable to create this client row" });
    }
  }

  const statusCode = failed.length ? 207 : 201;
  return res.status(statusCode).json({
    msg: "DONE",
    created,
    failed,
    message: `${created.length} client(s) created${failed.length ? `; ${failed.length} row(s) failed` : ""}`,
  });
};

//@desc User Login with username and password
//@route POST /api/v1/client/login/
//@access PUBLIC
const logIn = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/client/login responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);

  const username = data.username;
  const password = data.password;

  try {
    const oldClient = await Client.findOne({ username, active: { $ne: false } });

    if (!oldClient) {
      const deletedClient = await Client.exists({ username });
      logger.error(
        `${ip}: API /api/v1/client/login responnded with Client Not Found for the username: ${username}`
      );
      if (deletedClient) {
        return res.status(404).json({ message: "Client Deleted" });
      }
      return res
        .status(404)
        .json({ message: "Client Not Found, Please Signup" });
    }

    if (!oldClient.approved) {
      logger.error(
        `${ip}: API /api/v1/client/login responnded with client Disabled: ${username}`
      );
      return res.status(402).json({ status: 402, message: "Client Disabled" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      oldClient.password
    );

    if (!isPasswordCorrect) {
      logger.error(
        `${ip}: API /api/v1/client/login responnded with Incorrect Password for the username: ${username}`
      );
      return res
        .status(401)
        .json({ status: 401, message: "Incorrect Password" });
    }

    // Keep JWT small to avoid header bloat; only include essentials
    const tokenPayload = {
      _id: oldClient._id,
      username: oldClient.username,
      email: oldClient.email,
      roleType: { name: "client" },
      active: oldClient.active,
      approved: oldClient.approved,
    };

    const token = jwt.sign({ user: tokenPayload }, secret, {
      expiresIn: "48hr",
    });
    //console.log(token);
    logger.info(
      `${ip}: API /api/v1/client/login responnded with Login Successfull for the username: ${username}`
    );
    const clientResponse = oldClient.toObject();
    delete clientResponse.password;
    return res
      .status(200)
      .json({ data: clientResponse, token, message: "Login Successfull" });
  } catch (error) {
    logger.info(`${ip}: API /api/v1/client/login responnded with error`);
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Update Newly Created Client
//@route POST /api/v1/client/update/created/client
//@access Private: Needs Login
const updateCreatedClient = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const data = matchedData(req);

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/client/add | User: ${
        user?.name || "Guest"
      } | Responded with Error`
    );
    return res.status(400).json({ errors: errors.array() });
  }

  if (!user) {
    logger.error(
      `${ip}: API /api/v1/user/add | User: ${user.name} | responnded with Client is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const securedPass = await bcrypt.hash(data.password, salt);
    const newUser = await User.findOneAndUpdate(
      { _id: data.user_id },
      {
        name: data.name,
        password: securedPass,
        whatsapp_no: data.whatsapp_no,
        city: data.city,
        address: data.address,
        country: data.country,
        state: data.state,
        pin_code: data.pin_code,
        team: data.team,
        roleType: data.roleType,
        department: data.department,
      }
    );

    const newClient = await Client.findOneAndUpdate(
      { user_id: data.user_id },
      {
        name: data.name,

        whatsapp_no: data.whatsapp_no,
        city: data.city,
        address: data.address,
        country: data.country,
        state: data.state,
        pin_code: data.pin_code,
      },
      {
        new: true,
      }
    );

    logger.info(
      `${ip}: API /api/v1/client/add | User: ${newUser.name} | Responded with Success`
    );
    return res.status(201).json(omitPassword(newUser));
  } catch (err) {
    logger.error(
      `${ip}: API /api/v1/client/add | User: ${
        user?.name || "Guest"
      } | Responded with Error`
    );
    console.log(err);
    return res.status(500).json({ error: "Error", message: err.message });
  }
};

//@desc Add Client Details
//@route PUT /api/v1/client/add/details/:id
//@access Private: Needs Login
const AddClientDetails = async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const data = matchedData(req);

  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/client/add/details/:${id} | User: ${
        user?.name || "Guest"
      } | Responded with Validation Error`
    );
    return res.status(400).json({ errors: errors.array() });
  }

  if (!user) {
    logger.error(
      `${ip}: API /api/v1/client/add/details/:${id} | User: ${user.name} | responnded with Client is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }

  try {
    const client = await Client.findOneAndUpdate(
      { _id: id },
      {
        pf_enable: data.pf_enable,
        esic_enable: data.esic_enable,
        pan_card: data.pan_card,
        adhar_card: data.adhar_card,
        gst_no: data.gst_no,
        cin_no: data.cin_no,
        industry_type: data.industry_type,
        employee_count_range: data.employee_count_range,
        incorporation_type: data.incorporation_type,
        contact_person: {
          name: data.contact_person.name,
          email: data.contact_person.email,
          contact_no: data.contact_person.contact_no,
          designation: data.contact_person.designation,
        },
      },
      {
        new: true,
      }
    );

    if (!client) {
      logger.error(
        `${ip}: API /api/v1/client/add/details/:${id} | User: ${user.name} | Responded with Client Not Found `
      );
      return res.status(404).json({ message: "Client Not Found" });
    }

    logger.info(
      `${ip}: API /api/v1/client/add/details/:${id} | User: ${user.name} | Responded with Success`
    );
    return res.status(200).json(omitPassword(client));
  } catch (err) {
    logger.error(
      `${ip}: API /api/v1/client/add/details/:${id} | User: ${
        user?.name || "Guest"
      } | Responded with Error`
    );
    return res.status(500).json({ error: "Error", message: err.message });
  }
};

//@desc Get all Clients
//@route GET /api/v1/client/getall
//@access Private: Needs Login
const getAllClients = async (req, res) => {
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    if (user && ["super_admin", "admin"].includes(user.roleType?.name)) {
      // Keep disapproved clients available for re-approval, while excluding new and legacy soft-deletes.
      const clients = await Client.find({
        deletedAt: null,
        $or: [{ active: { $ne: false } }, { approved: false }],
      })
        .populate("contact_person")
        .sort({ createdAt: -1 });

      logger.info(
        `${ip}: API /api/v1/client/getall | User: ${user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: clients.map(omitPassword),
        message: "User retrived successfully",
      });
    } else {
      logger.error(
        `${ip}: API /api/v1/client/getall | User: ${user.name} | responnded with Client is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/client/getall | User: ${user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Get all Clients
//@route GET /api/v1/client/get/:client_user_id
//@access Private: Needs Login
const getClients = async (req, res) => {
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { client_user_id } = req.params;

  try {
    if (user) {
      const clients = await Client.find({
        client_user_id: client_user_id,
        active: true,
      }).populate("contact_person");

      logger.info(
        `${ip}: API /api/v1/client/getall | User: ${user.name} | responnded with Success `
      );
      return await res.status(200).json({
        data: clients.map(omitPassword),
        message: "User retrived successfully",
      });
    } else {
      logger.error(
        `${ip}: API /api/v1/client/getall | User: ${user.name} | responnded with Client is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/client/getall | User: ${user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Get Client with id
//@route GET /api/v1/client/get/:id
//@access Private: Needs Login
const getClient = async (req, res) => {
  const loggedin_user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    if (loggedin_user) {
      const { id } = req.params;
      let client = await Client.find({
        _id: id,
      }).populate("contact_person");
      if (client.length <= 0) {
        console.log("finding by user_id");
        client = await Client.find({
          user_id: id,
        }).populate("contact_person");
      }

      if (client.length > 0) {
        logger.info(
          `${ip}: API /api/v1/client/get/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return await res.status(200).json({
          data: client.map(omitPassword),
          message: "User retrived successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/client/get/:${id} | User: ${loggedin_user.name} | responnded Empty i.e. Client was not found `
        );
        return await res.status(200).json({
          message: "User Not Found",
        });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/client/get/:${id} | User: ${loggedin_user.name} | responnded with Client is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/client/get/:id | User: ${loggedin_user.name} | responnded with Error `
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Update Client with id
//@route PUT /api/v1/client/update/:id
//@access Private: Needs Login
const updateClient = async (req, res) => {
  const loggedin_user = req.user;
  const { id } = req.params;

  const data = matchedData(req);

  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/client/update/:${id} | User: ${loggedin_user.name} | responnded with Validation Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  if (
    data.email !== undefined &&
    !["admin", "super_admin"].includes(loggedin_user?.roleType?.name)
  ) {
    return res.status(403).json({ message: "Only admins can change a client's company email" });
  }
  const audienceFields = ["notificationDepartment", "notificationRole"];
  const isChangingAudience = audienceFields.some((field) =>
    Object.prototype.hasOwnProperty.call(req.body || {}, field)
  );
  if (
    isChangingAudience &&
    !["admin", "super_admin"].includes(loggedin_user?.roleType?.name)
  ) {
    return res.status(403).json({ message: "Only admins can change notification audience assignments" });
  }

  if (loggedin_user) {
    try {
      const oldClient = await Client.findOne({ _id: id });
      if (oldClient) {
        const normalizedEmail =
          typeof data.email === "string" ? data.email.trim().toLowerCase() : data.email;
        if (normalizedEmail !== undefined) {
          const linkedUser = oldClient.user_id
            ? await User.findById(oldClient.user_id).select("email").lean()
            : null;
          const currentIdentityEmails = [oldClient.email, linkedUser?.email]
            .filter((email) => typeof email === "string")
            .map((email) => email.trim().toLowerCase());

          // Editing other client details must not reject the email already
          // belonging to this client or its linked login account.
          if (!currentIdentityEmails.includes(normalizedEmail)) {
            const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const emailPattern = new RegExp(`^${escapedEmail}$`, "i");
            const existingClient = await Client.findOne({
              email: emailPattern,
              _id: { $ne: oldClient._id },
            });
            const existingUser = oldClient.user_id
              ? await User.findOne({
                  email: emailPattern,
                  _id: { $ne: oldClient.user_id },
                })
              : null;
            if (existingClient || existingUser) {
              return res.status(409).json({ message: "This company email is already in use" });
            }
          }
        }

        const clientUpdates = {
          name: data.name,
          email: normalizedEmail === undefined ? oldClient.email : normalizedEmail,
          username: data.username,
          pf_enable: data.pf_enable,
          esic_enable: data.esic_enable,
          whatsapp_no: data.whatsapp_no,
          city: data.city,
          address: data.address,
          country: data.country,
          state: data.state,
          pin_code: data.pin_code,
          pan_card: data.pan_card,
          adhar_card: data.adhar_card,
          gst_no: data.gst_no,
          cin_no: data.cin_no,
          industry_type: data.industry_type,
          employee_count_range: data.employee_count_range,
          incorporation_type: data.incorporation_type,
          contact_person: {
            name: data.contact_person.name,
            email: data.contact_person.email,
            contact_no: data.contact_person.contact_no,
            designation: data.contact_person.designation,
          },
        };
        if (Object.prototype.hasOwnProperty.call(req.body || {}, "notificationDepartment")) {
          clientUpdates.notificationDepartment = data.notificationDepartment || null;
        }
        if (Object.prototype.hasOwnProperty.call(req.body || {}, "notificationRole")) {
          clientUpdates.notificationRole = data.notificationRole || null;
        }

        const result = await Client.findByIdAndUpdate(
          id,
          clientUpdates,
          {
            new: true,
          }
        );

        if (normalizedEmail !== undefined && oldClient.user_id) {
          await User.findByIdAndUpdate(
            oldClient.user_id,
            { email: normalizedEmail },
            { new: true, runValidators: true }
          );
        }

        logger.info(
          `${ip}: API /api/v1/client/update/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: omitPassword(result), message: "Client Updated Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/client/update/:${id} | User: ${loggedin_user.name} | responnded with Client Not Found `
        );
        return res.status(200).json({ message: "Client Not Found" });
      }
    } catch (error) {
      logger.error(
        `${ip}: API /api/v1/client/update/:${id} | User: ${loggedin_user.name} | responnded with Error `
      );
      return res
        .status(500)
        .json({ data: error, message: "Something went wrong" });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/client/update/:${id} | User: ${loggedin_user.name} | responnded with Client is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

const updateClientNotificationAudience = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  if (!user) return res.status(401).json({ message: "User is not authorized" });
  if (!["admin", "super_admin"].includes(user.roleType?.name)) {
    return res.status(403).json({ message: "Only admins can assign notification audiences" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const client = await Client.findByIdAndUpdate(
      id,
      {
        notificationDepartment: req.body.notificationDepartment || null,
        notificationRole: req.body.notificationRole || null,
      },
      { new: true }
    );
    if (!client) return res.status(404).json({ message: "Client not found" });
    return res.status(200).json({ data: omitPassword(client), message: "Notification audience saved" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to save notification audience" });
  }
};

//@desc Delete Client with id (we are updating active to false )
//@route PUT /api/v1/client/delete/:id
//@access Private: Needs Login
const deleteClient = async (req, res) => {
  const loggedin_user = req.user;
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!loggedin_user) {
    return res.status(401).json({ message: "User is not authorized" });
  }
  if (!["admin", "super_admin"].includes(loggedin_user.roleType?.name)) {
    logger.info(
      `${ip}: API /api/v1/client/delete/:${id} | User: ${loggedin_user.name} | denied for role ${loggedin_user.roleType?.name || "unknown"}`
    );
    return res.status(403).json({ message: "Admin access is required to delete a client" });
  }

  try {
    const updated = { active: false, deletedAt: new Date() };
    // Soft-delete the client and any linked user; try user_id before the client _id.
    let client = await Client.findOne({ user_id: id });
    if (!client) {
      client = await Client.findOne({ _id: id });
    }

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const clientRes = await Client.findOneAndUpdate(
      { _id: client._id },
      updated,
      { new: true }
    );

    if (client.user_id) {
      await User.findByIdAndUpdate(client.user_id, { active: false }, { new: true });
    }

    const linkedOwnerIds = [client._id, client.user_id].filter(Boolean);
    const employeeDeactivation = await Employee.updateMany(
      {
        $or: [
          { client_id: { $in: linkedOwnerIds } },
          { client_user_id: { $in: linkedOwnerIds } },
          { user_id: { $in: linkedOwnerIds } },
        ],
      },
      { $set: { active: false, updated_at: new Date() } }
    );

    logger.info(
      `${ip}: API /api/v1/client/delete/:${id} | User: ${loggedin_user.name} | deactivated ${employeeDeactivation.modifiedCount} linked employee(s)`
    );
    return res.status(200).json({
      data: omitPassword(clientRes),
      message: "Client deleted successfully",
    });
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/client/delete/:${id} | User: ${loggedin_user.name} | responded with Error`
    );
    return res.status(500).json({ message: "Unable to delete client" });
  }
};

//@desc Get current Logged in USer
//@route POST /api/v1/client/getCurrent/
//@access Private Needs Login
const getCurrent = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    const user = await Client.find({
      _id: req.user._id,
    });

    if (user.length > 0) {
      logger.info(
        `${ip}: API /api/v1/client/getCurrent/:${req.user._id}  responnded with Success `
      );
      return await res.status(200).json({
        user: omitPassword(user[0]),
      });
    }
  } catch (error) {
    console.log(error);
    logger.info(
      `${ip}: API /api/v1/client/getCurrent responnded with the Error`
    );
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//@desc Update Client approved with id (we are updating active to false )
//@route PUT /api/v1/client/app_dis/:id
//@access Private: Needs Login
const AppDisClient = async (req, res) => {
  const loggedin_user = req.user;
  const { id } = req.params;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    if (loggedin_user) {
      let oldUser = await Client.findOne({ user_id: id });
      if (!oldUser) {
        oldUser = await Client.findOne({ _id: id });
      }

      if (oldUser) {
        if (oldUser.approved) {
          const updatedClient = {
            approved: false,
            active: false,
          };
          const updatedUser = {
            approved: false,
          };

          const clientRes = await Client.findOneAndUpdate(
            { _id: oldUser._id },
            updatedClient,
            {
              new: true,
            }
          );

          const UserRes = await User.findOneAndUpdate(
            { _id: oldUser.user_id || id },
            updatedUser,
            {
              new: true,
            }
          );

          logger.info(
            `${ip}: API /api/v1/client/app_dis/:${id} | User: ${loggedin_user.name} | responnded with Success `
          );
          return res.status(200).json({
            data: omitPassword(clientRes),
            message: "User Approved/Disapproved Successfully",
          });
        } else {
          const updatedClient = {
            approved: true,
            active: true,
          };
          const updatedUser = {
            approved: true,
          };
          const clientRes = await Client.findOneAndUpdate(
            { _id: oldUser._id },
            updatedClient,
            {
              new: true,
            }
          );
          const UserRes = await User.findOneAndUpdate(
            { _id: oldUser.user_id || id },
            updatedUser,
            {
              new: true,
            }
          );

          logger.info(
            `${ip}: API /api/v1/client/app_dis/:${id} | User: ${loggedin_user.name} | responnded with Success `
          );
          return res.status(200).json({
            data: omitPassword(clientRes),
            message: "User Approved/Disapproved Successfully",
          });
        }
      } else {
        logger.info(
          `${ip}: API /api/v1/client/app_dis/:${id} | User: ${loggedin_user.name} | responnded with Client Not Found `
        );
        return res.status(200).json({ message: "User Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/client/app_dis/:${id} | User: ${loggedin_user.name} | responnded with Client is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/client/app_dis/:${id} | User: ${loggedin_user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Change password of Client with id
//@route PUT /api/v1/client/change/pass/:id
//@access Private: Needs Login
const changePass = async (req, res) => {
  const loggedin_user = req.user;
  const { id } = req.params;
  const { password } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/client/change/pass/:${id} | User: ${loggedin_user.name} | responnded with Validation Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (loggedin_user) {
      const oldClient = await Client.findOne({ _id: id });
      const salt = await bcrypt.genSalt(10);
      const securedPass = await bcrypt.hash(password, salt);
      if (oldClient) {
        const updatedUser = {
          password: securedPass,
        };
        const result = await Client.findByIdAndUpdate(id, updatedUser, {
          new: true,
        });
        logger.info(
          `${ip}: API /api/v1/client/change/pass/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return res.status(200).json({
          data: omitPassword(result),
          message: "Client Password Changed Successfully",
        });
      } else {
        logger.info(
          `${ip}: API /api/v1/client/change/pass/:${id} | User: ${loggedin_user.name} | responnded with Client Not Found `
        );
        return res.status(200).json({ message: "Client Not Found" });
      }
    } else {
      logger.error(
        `${ip}: API /api/v1/client/change/pass/:${id} | User: ${loggedin_user.name} | responnded with Client is not Autherized `
      );
      return res.status(401).send({ message: "User is not Autherized" });
    }
  } catch (error) {
    logger.error(
      `${ip}: API /api/v1/client/change/pass/:${id} | User: ${loggedin_user.name} | responnded with Error `
    );
    return res
      .status(500)
      .json({ data: error, message: "Something went wrong" });
  }
};

//@desc Update Client with id
//@route PUT /api/v1/client/update/document/:id
//@access Private: Needs Login
const updateDocument = async (req, res) => {
  const loggedin_user = req.user;
  const { id } = req.params;

  const data = matchedData(req);

  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(
      `${ip}: API /api/v1/client/update/:${id} | User: ${loggedin_user.name} | responnded with Validation Error `
    );
    return res.status(400).json({ errors: errors.array() });
  }

  const supportedDocumentTypes = ["adhar", "pan", "gst", "cin"];
  if (!supportedDocumentTypes.includes(data.document_type)) {
    return res.status(400).json({ message: "Unsupported client document type" });
  }
  const isAdmin = ["admin", "super_admin"].includes(loggedin_user?.roleType?.name);
  const isClientOwner = loggedin_user?.roleType?.name === "client";
  if (!isAdmin && !isClientOwner) {
    return res.status(403).json({ message: "Admin or client access is required" });
  }

  if (loggedin_user) {
    try {
      const oldUser = await Client.findOne({ _id: id });
      if (
        isClientOwner &&
        (!oldUser || String(oldUser._id) !== String(loggedin_user._id))
      ) {
        return res.status(403).json({ message: "You can update documents only for your own client account" });
      }
      if (oldUser) {
        const type = data.document_type;
        const client = await Client.findByIdAndUpdate(
          id,
          {
            [`${type}_proof_url`]: data.document_url,
            [`${type}_proof`]: true,
            [`${type}_proof_url_id`]: data.document_url_id,
          },
          { new: true }
        );

        const previousDocumentId = oldUser[`${type}_proof_url_id`];
        if (
          previousDocumentId &&
          String(previousDocumentId) !== String(data.document_url_id) &&
          /^[a-f\d]{24}$/i.test(String(previousDocumentId))
        ) {
          try {
            await StoredDocument.findByIdAndDelete(previousDocumentId);
          } catch (cleanupError) {
            logger.warn(
              `${ip}: API /api/v1/client/update/document/:${id} | Unable to remove replaced document: ${cleanupError.message}`
            );
          }
        }

        logger.info(
          `${ip}: API /api/v1/client/update/:${id} | User: ${loggedin_user.name} | responnded with Success `
        );
        return res
          .status(200)
          .json({ data: omitPassword(client), message: "Client Updated Successfully" });
      } else {
        logger.info(
          `${ip}: API /api/v1/client/update/:${id} | User: ${loggedin_user.name} | responnded with Client Not Found `
        );
        return res.status(200).json({ message: "User Not Found" });
      }
    } catch (error) {
      logger.error(
        `${ip}: API /api/v1/client/update/:${id} | User: ${loggedin_user.name} | responnded with Error `
      );
      return res
        .status(500)
        .json({ data: error, message: "Something went wrong" });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/client/update/:${id} | User: ${loggedin_user.name} | responnded with Client is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

module.exports = {
  testClientAPI,
  createClient,
  uploadClient,
  updateCreatedClient,
  AddClientDetails,
  getAllClients,
  getClients,
  getClient,
  updateClient,
  updateClientNotificationAudience,
  deleteClient,
  updateDocument,
  getCurrent,
  AppDisClient,
  changePass,
  logIn,
};
