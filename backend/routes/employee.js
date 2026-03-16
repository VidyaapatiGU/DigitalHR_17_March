const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  testEmployeeAPI,
  createEmployee,
  createEmployeesByExcel,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
  getClientEmployees,
  updateEmployeeWithEmpCode,
  getEmployee,
  getEmployeeByEmail,

  AppDisEmployee,
  updateDocument,
  changePass,
  logIn,
} = require("../controllers/employee");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test Employee API
//@route GET /api/v1/employee
//@access Private: Needs Login
router.get("/", validateToken, testEmployeeAPI);

//@desc Create New Employee
//@route POST /api/v1/employee/add
//@access Private: Needs Login
router.post(
  "/add",

  [
    body("client_user_id", "Enter a valid client user id").notEmpty(),
    body("client_id"),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("gender", "Select a valid gender").isIn(["Male", "Female", "Other"]),
    body("password", "Password must have atlest 5 character!").isLength({
      min: 5,
    }),
    body("fatherHusband_name", "Enter a valid fatherHusband_name").notEmpty(),
    body("email", "Enter a Valid Email").isEmail(),
    body("whatsapp_no", "Enter a Valid Whatsapp Number").notEmpty().isNumeric(),
    body("password", "Password must have atlest 5 character").notEmpty(),
    body("city", "Enter a Valid city"),
    body("state", "Enter a Valid state"),
    body("country", "Enter a Valid country"),
    body("address", "Enter a Valid address"),
    body("pin_code", "Enter a Valid pin_code").isNumeric(),
    body("roleType", "Select a valid role id").notEmpty(),
    body("team", "Select a valid team id").notEmpty(),
    body("department", "Select a valid department id").notEmpty(),
    body("designation", "Enter a Valid designation").notEmpty(),
    body("date_of_joining", "Enter a Valid date_of_joining").isDate(),
    body("weeklyOff").optional().isArray(),

    body("adhar_card", "Enter a Valid adhar_card"),
    body("uan_no", "Enter a Valid uan_no"),
    body("pf_no", "Enter a Valid pf_no"),
    body("esic_no", "Enter a Valid esic_no"),
    body("ip_number").optional().isLength({ min: 10, max: 10 }).withMessage("ESIC IP Number must be 10 digits").isNumeric().withMessage("ESIC IP Number must be numeric"),
    body("bank_name", "Enter a Valid bank_name"),
    body("bank_ac_no", "Enter a Valid bank_ac_no"),
    body("bank_ifsc", "Enter a Valid bank_ifsc"),
    body("gross", "Enter a Valid gross"),
    body("pf_basic", "Enter a Valid pf_basic"),
    body("basic", "Enter a Valid basic"),
    body("da", "Enter a Valid da"),
    body("hra", "Enter a Valid hra"),
    body("food_allow", "Enter a Valid food_allow"),
    body("conveyance", "Enter a Valid conveyance"),
    body("epf", "Enter a Valid epf"),
    body("esic", "Enter a Valid esic"),
    body("lwf"),
    body("esi"),
    body("e_epf", "Enter a Valid e_epf"),
    body("e_esic", "Enter a Valid e_esic"),
  ],
  validateToken,
  createEmployee
);

//@desc Create New Employee
//@route POST /api/v1/employee/add/employees/excel
//@access Private: Needs Login
router.post(
  "/add/employees/excel",

  [
    body("client_user_id", "Enter a valid client user id").notEmpty(),
    body("client_id"),
    body("team", "team required"),
    body("department", "department required"),
    body("roleType", "roleType required"),
    body("employeeData", "Enter a valid employeeData"),
  ],
  validateToken,
  createEmployeesByExcel
);

//@desc Update Employee
//@route PUT /api/v1/employee/update/:id
//@access Private: Needs Login
router.put(
  "/update/:id",

  [
    body("name").optional({ nullable: true, checkFalsy: true }),
    body("gender").optional({ nullable: true, checkFalsy: true }).isIn(["Male", "Female", "Other"]),
    body("fatherHusband_name").optional({ nullable: true, checkFalsy: true }),
    body("email").optional({ nullable: true, checkFalsy: true }).isEmail(),
    body("whatsapp_no").optional({ nullable: true, checkFalsy: true }).isNumeric(),
    body("city").optional({ nullable: true, checkFalsy: true }),
    body("state").optional({ nullable: true, checkFalsy: true }),
    body("country").optional({ nullable: true, checkFalsy: true }),
    body("address").optional({ nullable: true, checkFalsy: true }),
    body("pin_code").optional({ nullable: true, checkFalsy: true }).isNumeric(),
    body("designation").optional({ nullable: true, checkFalsy: true }),
    body("weeklyOff").optional({ nullable: true, checkFalsy: true }).isArray(),
    
    body("adhar_card").optional({ nullable: true, checkFalsy: true }),
    body("uan_no").optional({ nullable: true, checkFalsy: true }),
    body("pf_no").optional({ nullable: true, checkFalsy: true }),
    body("esic_no").optional({ nullable: true, checkFalsy: true }),
    body("ip_number").optional({ nullable: true, checkFalsy: true }).isLength({ min: 10, max: 10 }).withMessage("ESIC IP Number must be 10 digits").isNumeric().withMessage("ESIC IP Number must be numeric"),
    body("bank_name").optional({ nullable: true, checkFalsy: true }),
    body("bank_ac_no").optional({ nullable: true, checkFalsy: true }),
    body("gross").optional({ nullable: true, checkFalsy: true }),
    body("bank_ifsc").optional({ nullable: true, checkFalsy: true }),
    body("pf_basic").optional({ nullable: true, checkFalsy: true }),
    body("basic").optional({ nullable: true, checkFalsy: true }),
    body("da").optional({ nullable: true, checkFalsy: true }),
    body("hra").optional({ nullable: true, checkFalsy: true }),
    body("food_allow").optional({ nullable: true, checkFalsy: true }),
    body("conveyance").optional({ nullable: true, checkFalsy: true }),
    body("epf").optional({ nullable: true, checkFalsy: true }),
    body("esic").optional({ nullable: true, checkFalsy: true }),
    body("lwf").optional({ nullable: true, checkFalsy: true }),
    body("esi").optional({ nullable: true, checkFalsy: true }),
    body("e_epf").optional({ nullable: true, checkFalsy: true }),
    body("e_esic").optional({ nullable: true, checkFalsy: true }),
  ],
  validateToken,
  updateEmployee
);

//@desc Update Employee Leaves using emp_code
//@route PUT /api/v1/employee/updateempwithcode/:id
//@access Private: Needs Login
router.put(
  "/updateempwithcode/:id",
  [
    body("leaves", "Leaves field is required").notEmpty(),
    body("leaves.cl.balance", "Leaves.cl.balance is required").notEmpty(),
    body("leaves.cl.absentDates", "Leaves.cl.absentDates must be an array").isArray(),
    body("leaves.sl.balance", "Leaves.sl.balance is required").notEmpty(),
    body("leaves.sl.absentDates", "Leaves.sl.absentDates must be an array").isArray(),
    body("leaves.pl.balance", "Leaves.pl.balance is required").notEmpty(),
    body("leaves.pl.absentDates", "Leaves.pl.absentDates must be an array").isArray(),
  ],
  validateToken,
  updateEmployeeWithEmpCode
);

//@desc Get all Employees
//@route GET /api/v1/employee/getall
//@access Private: Needs Login
router.get("/getall", validateToken, getAllEmployees);

//@desc Get all Employees
//@route GET /api/v1/employee/client_id
//@access Private: Needs Login
router.get(
  "/client/:client_id",
  validateToken,
  getClientEmployees
);

// Backward-compatible alias used by frontend to fetch employees by client
router.get(
  "/get/employees/by/client/:client_id",
  validateToken,
  getClientEmployees
);

//@desc Get Employee with id
//@route GET /api/v1/employee/get/:id
//@access Private: Needs Login
router.get("/get/:id", validateToken, getEmployee);

//@desc Get Employee by email
//@route GET /api/v1/employee/get/by/email/:email
//@access Private: Needs Login
router.get("/get/by/email/:email", validateToken, getEmployeeByEmail);

//@desc Delete Employee
//@route DELETE /api/v1/employee/delete/:id
//@access Private: Needs Login
router.delete("/delete/:id", validateToken, deleteEmployee);

//@desc Approve Employee
//@route PUT /api/v1/employee/approve/:id
//@access Private: Needs Login
router.put("/app_dis/:id", validateToken, AppDisEmployee);

//@desc Update Employee Document
//@route PUT /api/v1/employee/update/document/:id
//@access Private: Needs Login
router.put(
  "/update/document/:id",
  [
    body("document_type", "ducument_type is required").notEmpty(),
    body("document_url", "document_url is required").notEmpty(),
    body("document_url_id", "document_id is required").notEmpty(),
  ],
  validateToken,
  updateDocument
);

//@desc Change Password
//@route PUT /api/v1/employee/change/password/:id
//@access Private: Needs Login
router.put("/change/password/:id", validateToken, changePass);

//@desc User Login with email and password
//@route POST /api/v1/employee/login/
//@access PUBLIC
router.post(
  "/login/",
  [
    body("username"),
    body("password", "Password must have atlest 5 character").notEmpty(),
  ],
  logIn
);

module.exports = router;
