const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { body } = require("express-validator");
const validateToken = require("../middleware/validateTokenHandler");
const {
  createNotification,
  DismissNotification,
  GetAllNotificationsById,
  GetNotificationById,
  testNotificationAPI,
} = require("../controllers/notification.js");

//@desc Test Notification API
//@route GET /api/v1/notification
//@access Private: Needs Login
router.get(
  "/",
  validateToken,

  testNotificationAPI
);

//@desc Create Notification API
//@route POST /api/v1/notification/add
//@access Private: Needs Login
router.post(
  "/add",
  validateToken,
  [
    body("text", "Enter a valid text").trim().isLength({ min: 1, max: 2000 }),
    body("type", "Enter a valid type").isIn(["info", "success", "warning", "danger"]),
    body("to_user").optional({ checkFalsy: true }).isMongoId(),
    body("audience").optional().isObject(),
    body("audience.type").optional().isIn(["all_clients", "departments", "roles"]),
    body("audience.ids").optional().isArray(),
    body("audience.ids.*").optional().custom((value) =>
      value === "client" || mongoose.Types.ObjectId.isValid(value)
    ),
  ],
  createNotification
);

//@desc Get By Id Notification
//@route GET /api/v1/notification/get/:id
//@access Private: Needs Login
router.get("/get/:id", validateToken, GetNotificationById);

//@desc Dismiss Notification API
//@route PUT /api/v1/notification/dissmiss/:id
//@access Private: Needs Login
router.put("/dismiss/:id", validateToken, DismissNotification);

//@desc Get All
//@route GET /api/v1/notification/getall/:id
//@access Private: Needs Login
router.get("/getall/:id", validateToken, GetAllNotificationsById);

module.exports = router;
