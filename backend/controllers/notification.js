const mongoose = require("mongoose");
const { validationResult, matchedData } = require("express-validator");
const logger = require("../config/logger.js");
const User = require("../models/User.js");
const Admin = require("../models/Admin.js");
const Client = require("../models/Client.js");
const Employee = require("../models/Employee.js");
const Role = require("../models/Role.js");
const Department = require("../models/Department.js");
const Notification = require("../models/Notification.js");

const isAdmin = (user) => ["admin", "super_admin"].includes(user?.roleType?.name);

const getBroadcastRecipients = async (audience) => {
  const recipients = new Map();
  const addRecipients = (records) => {
    records.forEach((record) => {
      if (record?._id) recipients.set(String(record._id), String(record._id));
    });
  };
  const getActiveClients = async () => Client.find({
    active: { $ne: false },
    deletedAt: null,
  }).select("_id").lean();

  if (audience.type === "all_clients") {
    addRecipients(await getActiveClients());
    return [...recipients.values()];
  }

  const selectedIds = [...new Set((Array.isArray(audience.ids) ? audience.ids : []).map(String))];
  if (!selectedIds.length) return [];

  let memberUsers = [];
  let clientAudienceIds = [];
  if (audience.type === "departments") {
    const departmentIds = selectedIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (!departmentIds.length) return [];
    const activeDepartments = await Department.find({
      _id: { $in: departmentIds },
      active: { $ne: false },
    }).select("_id").lean();
    const activeDepartmentIds = activeDepartments.map((department) => department._id);
    if (!activeDepartmentIds.length) return [];
    clientAudienceIds = activeDepartmentIds;
    memberUsers = await User.find({
      department: { $in: activeDepartmentIds },
      active: { $ne: false },
    }).select("_id").lean();
  } else if (audience.type === "roles") {
    const targetClientAccounts = selectedIds.includes("client");
    const roleIds = selectedIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    const activeRoles = roleIds.length
      ? await Role.find({ _id: { $in: roleIds }, active: { $ne: false } }).select("_id name").lean()
      : [];
    const activeRoleIds = activeRoles.map((role) => role._id);
    clientAudienceIds = activeRoleIds;
    const activeRoleNames = activeRoles.map((role) => String(role.name || "").toLowerCase());
    const includesClientRole = targetClientAccounts || activeRoles.some(
      (role) => String(role.name || "").toLowerCase() === "client"
    );
    if (includesClientRole) addRecipients(await getActiveClients());
    const adminRoleNames = activeRoleNames.filter((name) => ["admin", "super_admin"].includes(name));
    if (adminRoleNames.length) {
      addRecipients(await Admin.find({
        role: { $in: adminRoleNames },
        active: { $ne: false },
      }).select("_id").lean());
    }
    if (activeRoleNames.includes("employee")) {
      addRecipients(await Employee.find({ active: { $ne: false } }).select("_id").lean());
    }
    if (activeRoleIds.length) {
      memberUsers = await User.find({
        roleType: { $in: activeRoleIds },
        active: { $ne: false },
      }).select("_id").lean();
    }
  } else {
    return [];
  }

  addRecipients(memberUsers);
  if (clientAudienceIds.length) {
    const audienceField = audience.type === "departments" ? "notificationDepartment" : "notificationRole";
    addRecipients(await Client.find({
      [audienceField]: { $in: clientAudienceIds },
      active: { $ne: false },
      deletedAt: null,
    }).select("_id").lean());
  }
  const memberUserIds = memberUsers.map((member) => member._id);
  if (memberUserIds.length) {
    const linkedClients = await Client.find({
      user_id: { $in: memberUserIds },
      active: { $ne: false },
      deletedAt: null,
    }).select("_id").lean();
    addRecipients(linkedClients);
  }

  return [...recipients.values()];
};

//@desc Test Role API
//@route GET /api/v1/notification
//@access Private: Needs Login
const testNotificationAPI = async (req, res) => {
  const user = req.user;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/notification | User: ${user.name} | responnded with Role Api Successful `
    );
    return res
      .status(200)
      .send({ data: user, message: "Notification Api Successful" });
  } else {
    logger.error(
      `${ip}: API /api/v1/notification | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Create New Role
//@route POST /api/v1/notification/add
//@access Private: Needs Login
const createNotification = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/role/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (!user) {
    logger.error(
      `${ip}: API /api/v1/notification/add | User is not authorized`
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }

  const data = req.body || {};
  try {
    if (data.audience?.type) {
      if (!isAdmin(user)) {
        return res.status(403).json({ message: "Only admins can broadcast notifications" });
      }

      const recipients = await getBroadcastRecipients(data.audience);
      if (!recipients.length) {
        return res.status(400).json({ message: "No active users or clients match this audience" });
      }

      const notifications = await Notification.insertMany(recipients.map((recipientId) => ({
        text: data.text.trim(),
        type: data.type,
        to_user: recipientId,
        by_user: user._id,
        audienceType: data.audience.type,
        audienceIds: Array.isArray(data.audience.ids) ? data.audience.ids.map(String) : [],
      })));

      return res.status(201).send({
        data: notifications,
        recipientCount: notifications.length,
        message: `Notification sent to ${notifications.length} account(s)`,
      });
    }

    if (!data.to_user) {
      return res.status(400).json({ message: "Choose a notification recipient" });
    }
    const response = await Notification.create({
      text: data.text.trim(),
      type: data.type,
      to_user: data.to_user,
      by_user: user._id,
    });
    return res.status(201).send({ data: response, message: "notification created" });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/notification/add | ${err.message}`);
    return res.status(500).send({ message: "Unable to send notification" });
  }
};

//@desc Get By Id Notification
//@route GET /api/v1/notification/get/:id
//@access Private: Needs Login
const GetNotificationById = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const id = req.params.id;
  console.log("id: ", id);

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/role/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    const data = matchedData(req);

    try {
      const response = await Notification.findById(id);

      return res.status(201).send({ data: response });
    } catch (err) {
      return res.status(500).send({ message: "something went wrong" });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/role/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Dismiss Notification API
//@route PUT /api/v1/notification/dissmiss/:id
//@access Private: Needs Login
const DismissNotification = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const id = req.params.id;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/role/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    try {
      const response = await Notification.findOneAndUpdate(
        { _id: id, to_user: user._id, dismissed: false },
        { dismissed: true },
        {
          new: true,
        }
      );

      if (!response) return res.status(404).send({ message: "Notification not found" });
      return res.status(200).send({ data: response });
    } catch (err) {
      return res.status(500).send({ message: "something went wrong" });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/role/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

//@desc Get All Notification
//@route GET /api/v1/notification/get/:id
//@access Private: Needs Login
const GetAllNotificationsById = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const id = req.params.id;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/role/add responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  if (user) {
    if (String(id) !== String(user._id)) {
      return res.status(403).json({ message: "You can only view your own notifications" });
    }

    try {
      const response = await Notification.find({
        to_user: id,
        dismissed: false,
      }).sort({ createDate: -1 });

      return res.status(200).send({ data: response });
    } catch (err) {
      return res.status(500).send({ message: "something went wrong" });
    }
  } else {
    logger.error(
      `${ip}: API /api/v1/role/add | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }
};

module.exports = {
  testNotificationAPI,
  createNotification,
  GetNotificationById,
  DismissNotification,
  GetAllNotificationsById,
};
