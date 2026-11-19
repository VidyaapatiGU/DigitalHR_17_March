const express = require("express");
const router = express.Router();
const {
  upload,
  testDocumentAPI,
  uploadDocument,
  uploadEmployeeDocument,
  uploadUserDocument,
  uploadClientDocument,
  getDocument,
  deleteDocument,
} = require("../controllers/document.js");
const validateToken = require("../middleware/validateTokenHandler");

//@desc Test Client API
//@route GET /api/v1/client
//@access Private: Needs Login
router.get("/", validateToken, testDocumentAPI);

//@desc Read a MongoDB-backed document
//@route GET /api/v1/document/file/:fileId
//@access Private: Needs Login
router.get("/file/:fileId", validateToken, getDocument);

//@desc Upload document
//@route POST /api/v1/document/upload
//@access Private: Needs Login
router.post(
  "/upload/client/:document/:id",
  validateToken,
  upload.single("file"),
  uploadClientDocument
);

router.post(
  "/upload/user/:document/:id",
  validateToken,
  upload.single("file"),
  uploadUserDocument
);

router.post(
  "/upload/employee/:document/:id",
  validateToken,
  upload.single("file"),
  uploadEmployeeDocument
);

router.post(
  "/upload/:document/:id",
  validateToken,
  upload.single("file"),
  uploadDocument
);

//@desc Delete document
//@route DELETE /api/v1/document/delete
//@access Private: Needs Login
router.delete(
  "/delete/:client_id/:filename/:file_type",
  validateToken,
  deleteDocument
);

module.exports = router;
