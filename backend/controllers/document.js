const mongoose = require("mongoose");
const multer = require("multer");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const User = require("../models/User");
const StoredDocument = require("../models/StoredDocument");
const logger = require("../config/logger.js");

const CLIENT_DOCUMENT_TYPES = ["pan", "adhar", "gst", "cin"];
const EMPLOYEE_DOCUMENT_TYPES = ["adhar", "asci", "bank"];
const USER_DOCUMENT_TYPES = ["adhar", "asci", "bank"];
const SUPPORTED_DOCUMENT_TYPES = new Set([
  ...CLIENT_DOCUMENT_TYPES,
  ...EMPLOYEE_DOCUMENT_TYPES,
]);
const SUPPORTED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
const MAX_DOCUMENT_SIZE = 4 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_DOCUMENT_SIZE },
});

const getClientDocumentFields = (fileId) =>
  CLIENT_DOCUMENT_TYPES.map((type) => ({ [`${type}_proof_url_id`]: fileId }));

const getEmployeeDocumentFields = (fileId) =>
  EMPLOYEE_DOCUMENT_TYPES.map((type) => ({ [`${type}_proof_url_id`]: fileId }));

const getUserDocumentFields = (fileId) =>
  USER_DOCUMENT_TYPES.map((type) => ({ [`${type}_proof_url_id`]: fileId }));

const isDocumentOwner = (user, client, employee, accountUser) => {
  const role = user?.roleType?.name || user?.role;
  const userId = String(user?._id || "");

  if (["admin", "super_admin"].includes(role)) return true;

  if (role === "client") {
    const ownsClient = Boolean(
      client &&
        (String(client._id) === userId || String(client.user_id || "") === userId)
    );
    const linkedClientId = user?.client_id?._id || user?.client_id;
    const clientReferences = [userId, linkedClientId].filter(Boolean).map(String);
    const employeeReferences = [employee?.client_id, employee?.client_user_id, employee?.user_id]
      .filter(Boolean)
      .map(String);
    return ownsClient || employeeReferences.some((reference) => clientReferences.includes(reference));
  }
  if (role === "employee") {
    return Boolean(
      employee &&
        (String(employee.user_id || "") === userId || String(employee._id) === userId)
    );
  }
  if (role === "user") {
    const linkedClientId = user?.client_id?._id || user?.client_id;
    const clientReferences = [userId, linkedClientId].filter(Boolean).map(String);
    const employeeReferences = [employee?.client_id, employee?.client_user_id, employee?.user_id]
      .filter(Boolean)
      .map(String);
    return Boolean(accountUser && String(accountUser._id) === userId) ||
      employeeReferences.some((reference) => clientReferences.includes(reference));
  }

  if (employee && user?.client_id) {
    const clientId = String(user.client_id?._id || user.client_id);
    return [employee.client_id, employee.client_user_id, employee.user_id]
      .filter(Boolean)
      .some((reference) => String(reference) === clientId);
  }

  return Boolean(accountUser && String(accountUser._id) === userId);
};

const USER_DOCUMENT_FIELD_MAP = {
  adhar: { proof: "adhar_proof", url: "adhar_proof_url", urlId: "adhar_proof_url_id" },
  asci: { proof: "asci_proof", url: "asci_proof_url", urlId: "asci_proof_url_id" },
  bank: { proof: "bank_proof", url: "bank_proof_url", urlId: "bank_proof_url_id" },
};

const CLIENT_DOCUMENT_FIELD_MAP = {
  pan: { proof: "pan_proof", url: "pan_proof_url", urlId: "pan_proof_url_id" },
  adhar: { proof: "adhar_proof", url: "adhar_proof_url", urlId: "adhar_proof_url_id" },
  gst: { proof: "gst_proof", url: "gst_proof_url", urlId: "gst_proof_url_id" },
  cin: { proof: "cin_proof", url: "cin_proof_url", urlId: "cin_proof_url_id" },
};

const EMPLOYEE_DOCUMENT_FIELD_MAP = {
  adhar: { proof: "adhar_proof", url: "adhar_proof_url", urlId: "adhar_proof_url_id" },
  asci: { proof: "asci_proof", url: "asci_proof_url", urlId: "asci_proof_url_id" },
  bank: { proof: "bank_proof", url: "bank_proof_url", urlId: "bank_proof_url_id" },
};

//@desc Test Document API
//@route GET /api/v1/document
//@access Private: Needs Login
const testDocumentAPI = async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ message: "User is not authorized" });
  }
  return res.status(200).send("Document API Test Successfully");
};

//@desc Save a document in MongoDB
//@route POST /api/v1/document/upload/:document/:id
//@access Private: Needs Login
const uploadDocument = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const { document, id } = req.params;

  if (!user) {
    return res.status(401).json({ message: "User is not authorized" });
  }
  if (!SUPPORTED_DOCUMENT_TYPES.has(document)) {
    return res.status(400).json({ message: "Unsupported document type" });
  }

  if (CLIENT_DOCUMENT_TYPES.includes(document)) {
    const role = user.roleType?.name;
    const selectors = [{ _id: id }];
    if (mongoose.Types.ObjectId.isValid(id)) selectors.push({ user_id: id });
    let client;
    try {
      client = await Client.findOne({ $or: selectors, active: { $ne: false } });
    } catch (err) {
      return res.status(500).json({ message: "Unable to verify client access" });
    }

    const isOwner =
      role === "client" &&
      client &&
      (String(client._id) === String(user._id) ||
        String(client.user_id || "") === String(user._id));
    const isAdmin = ["admin", "super_admin"].includes(role);
    if (role === "client" && !client) {
      return res.status(404).json({ message: "Client not found" });
    }
    if (client && !isOwner && !isAdmin) {
      return res.status(403).json({ message: "You cannot upload documents for this client" });
    }
    if (!client && document !== "adhar") {
      return res.status(404).json({ message: "Client not found" });
    }
  }

  const file = req.file;
  if (!file || !file.originalname || !file.buffer) {
    return res.status(400).json({ message: "Select a document to upload" });
  }
  if (!SUPPORTED_MIME_TYPES.has(file.mimetype)) {
    return res.status(400).json({ message: "Only PDF, JPEG, or PNG files are supported" });
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    return res.status(413).json({ message: "Documents must be 4 MB or smaller" });
  }

  try {
    const storedDocument = await StoredDocument.create({
      filename: file.originalname,
      documentType: document,
      entityId: String(id),
      uploadedBy: String(user._id || ""),
      contentType: file.mimetype,
      data: file.buffer,
    });
    const fileId = String(storedDocument._id);
    const location = `/api/v1/document/file/${fileId}`;

    logger.info(
      `${ip}: API /api/v1/document/upload | User: ${user.name || user.username || "Unknown"} | document saved to MongoDB`
    );
    return res.status(201).json({ location: { Location: location }, file_id: fileId });
  } catch (err) {
    logger.error(
      `${ip}: API /api/v1/document/upload | User: ${user.name || "Unknown"} | MongoDB document save failed: ${err.message}`
    );
    return res.status(500).json({ message: "Unable to save document to MongoDB" });
  }
};

//@desc Save a user document in MongoDB and link it to the user
//@route POST /api/v1/document/upload/user/:document/:id
//@access Private: Admin or owner
const uploadUserDocument = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const { document, id } = req.params;
  const role = user?.roleType?.name;

  if (!user) {
    return res.status(401).json({ message: "User is not authorized" });
  }
  if (!USER_DOCUMENT_TYPES.includes(document)) {
    return res.status(400).json({ message: "Unsupported document type" });
  }
  if (!["admin", "super_admin"].includes(role) && !(role === "user" && String(user._id) === id)) {
    return res.status(403).json({ message: "You cannot upload documents for this user" });
  }

  const file = req.file;
  if (!file || !file.originalname || !file.buffer) {
    return res.status(400).json({ message: "Select a document to upload" });
  }
  if (!SUPPORTED_MIME_TYPES.has(file.mimetype)) {
    return res.status(400).json({ message: "Only PDF, JPEG, or PNG files are supported" });
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    return res.status(413).json({ message: "Documents must be 4 MB or smaller" });
  }

  try {
    const existingUser = await User.findOne({ _id: id, active: { $ne: false } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const fields = USER_DOCUMENT_FIELD_MAP[document];
    const previousFileId = existingUser[fields.urlId];
    const storedDocument = await StoredDocument.create({
      filename: file.originalname,
      documentType: document,
      entityId: String(id),
      uploadedBy: String(user._id || ""),
      contentType: file.mimetype,
      data: file.buffer,
    });
    const fileId = String(storedDocument._id);
    const location = `/api/v1/document/file/${fileId}`;

    try {
      const updatedUser = await User.findByIdAndUpdate(id, {
        [fields.proof]: true,
        [fields.url]: location,
        [fields.urlId]: fileId,
      });
      if (!updatedUser) {
        await StoredDocument.findByIdAndDelete(fileId);
        return res.status(404).json({ message: "User not found" });
      }
    } catch (updateError) {
      await StoredDocument.findByIdAndDelete(fileId);
      throw updateError;
    }

    if (previousFileId && mongoose.Types.ObjectId.isValid(previousFileId)) {
      await StoredDocument.findByIdAndDelete(previousFileId).catch((cleanupError) => {
        logger.error(`Unable to remove replaced user document ${previousFileId}: ${cleanupError.message}`);
      });
    }

    logger.info(
      `${ip}: API /api/v1/document/upload/user | User: ${user.name || user.username || "Unknown"} | document saved to MongoDB`
    );
    return res.status(201).json({ location: { Location: location }, file_id: fileId });
  } catch (err) {
    logger.error(
      `${ip}: API /api/v1/document/upload/user | User: ${user.name || "Unknown"} | MongoDB document save failed: ${err.message}`
    );
    return res.status(500).json({ message: "Unable to save document" });
  }
};

//@desc Save an employee proof document in MongoDB and link it to the employee
//@route POST /api/v1/document/upload/employee/:document/:id
//@access Private: Admin, linked client user, or employee self
const uploadEmployeeDocument = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const { document, id } = req.params;
  const role = user?.roleType?.name || user?.role;

  if (!user) return res.status(401).json({ message: "User is not authorized" });
  if (!Object.hasOwn(EMPLOYEE_DOCUMENT_FIELD_MAP, document)) {
    return res.status(400).json({ message: "Unsupported employee document type" });
  }

  const file = req.file;
  if (!file || !file.originalname || !file.buffer) {
    return res.status(400).json({ message: "Select a document to upload" });
  }
  if (!SUPPORTED_MIME_TYPES.has(file.mimetype)) {
    return res.status(400).json({ message: "Only PDF, JPEG, or PNG files are supported" });
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    return res.status(413).json({ message: "Documents must be 4 MB or smaller" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Employee not found" });
  }

  try {
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const isAdmin = ["admin", "super_admin"].includes(role);
    const isEmployeeSelf = role === "employee" && String(employee._id) === String(user._id);
    const userClientId = user.client_id?._id || user.client_id;
    const employeeClientIds = [employee.client_id, employee.client_user_id, employee.user_id]
      .filter(Boolean)
      .map(String);
    const callerClientIds = [user._id, userClientId].filter(Boolean).map(String);
    const isLinkedClient = ["client", "user"].includes(role) || Boolean(userClientId)
      ? callerClientIds.some((reference) => employeeClientIds.includes(reference))
      : false;
    if (!isAdmin && !isEmployeeSelf && !isLinkedClient) {
      return res.status(403).json({ message: "You cannot upload documents for this employee" });
    }

    const fields = EMPLOYEE_DOCUMENT_FIELD_MAP[document];
    const previousFileId = employee[fields.urlId];
    const storedDocument = await StoredDocument.create({
      filename: file.originalname,
      documentType: document,
      entityId: String(employee._id),
      uploadedBy: String(user._id || ""),
      contentType: file.mimetype,
      data: file.buffer,
    });
    const fileId = String(storedDocument._id);
    const location = `/api/v1/document/file/${fileId}`;

    try {
      employee[fields.proof] = true;
      employee[fields.url] = location;
      employee[fields.urlId] = fileId;
      await employee.save();
    } catch (updateError) {
      await StoredDocument.findByIdAndDelete(fileId);
      throw updateError;
    }

    if (previousFileId && mongoose.Types.ObjectId.isValid(previousFileId)) {
      await StoredDocument.findByIdAndDelete(previousFileId).catch((cleanupError) => {
        logger.error(`Unable to remove replaced employee document ${previousFileId}: ${cleanupError.message}`);
      });
    }

    logger.info(
      `${ip}: API /api/v1/document/upload/employee | User: ${user.name || user.username || "Unknown"} | document saved to MongoDB`
    );
    return res.status(201).json({
      location: { Location: location },
      file_id: fileId,
      document_type: document,
    });
  } catch (err) {
    logger.error(
      `${ip}: API /api/v1/document/upload/employee | User: ${user.name || user.username || "Unknown"} | document save failed: ${err.message}`
    );
    return res.status(500).json({ message: "Unable to save employee document" });
  }
};

//@desc Save a client document in MongoDB and link it to the client
//@route POST /api/v1/document/upload/client/:document/:id
//@access Private: Admin or client owner
const uploadClientDocument = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const { document, id } = req.params;
  const role = user?.roleType?.name;

  if (!user) {
    return res.status(401).json({ message: "User is not authorized" });
  }
  if (!Object.hasOwn(CLIENT_DOCUMENT_FIELD_MAP, document)) {
    return res.status(400).json({ message: "Unsupported client document type" });
  }

  const file = req.file;
  if (!file || !file.originalname || !file.buffer) {
    return res.status(400).json({ message: "Select a document to upload" });
  }
  if (!SUPPORTED_MIME_TYPES.has(file.mimetype)) {
    return res.status(400).json({ message: "Only PDF, JPEG, or PNG files are supported" });
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    return res.status(413).json({ message: "Documents must be 4 MB or smaller" });
  }

  try {
    const selectors = [{ _id: id }];
    if (mongoose.Types.ObjectId.isValid(id)) selectors.push({ user_id: id });
    const client = await Client.findOne({
      $or: selectors,
      active: { $ne: false },
      deletedAt: null,
    });
    if (!client) return res.status(404).json({ message: "Client not found" });

    const isAdmin = ["admin", "super_admin"].includes(role);
    const isOwner = role === "client" && (
      String(client._id) === String(user._id) || String(client.user_id || "") === String(user._id)
    );
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "You cannot upload documents for this client" });
    }

    const fields = CLIENT_DOCUMENT_FIELD_MAP[document];
    const previousFileId = client[fields.urlId];
    const storedDocument = await StoredDocument.create({
      filename: file.originalname,
      documentType: document,
      entityId: String(client._id),
      uploadedBy: String(user._id || ""),
      contentType: file.mimetype,
      data: file.buffer,
    });
    const fileId = String(storedDocument._id);
    const location = `/api/v1/document/file/${fileId}`;

    try {
      const updatedClient = await Client.findByIdAndUpdate(client._id, {
        [fields.proof]: true,
        [fields.url]: location,
        [fields.urlId]: fileId,
      });
      if (!updatedClient) {
        await StoredDocument.findByIdAndDelete(fileId);
        return res.status(404).json({ message: "Client not found" });
      }
    } catch (updateError) {
      await StoredDocument.findByIdAndDelete(fileId);
      throw updateError;
    }

    if (previousFileId && mongoose.Types.ObjectId.isValid(previousFileId)) {
      await StoredDocument.findByIdAndDelete(previousFileId).catch((cleanupError) => {
        logger.error(`Unable to remove replaced client document ${previousFileId}: ${cleanupError.message}`);
      });
    }

    logger.info(
      `${ip}: API /api/v1/document/upload/client | User: ${user.name || user.username || "Unknown"} | document saved to MongoDB`
    );
    return res.status(201).json({ location: { Location: location }, file_id: fileId });
  } catch (err) {
    logger.error(
      `${ip}: API /api/v1/document/upload/client | User: ${user.name || "Unknown"} | MongoDB document save failed: ${err.message}`
    );
    return res.status(500).json({ message: "Unable to save document" });
  }
};

//@desc Read a MongoDB-backed document
//@route GET /api/v1/document/file/:fileId
//@access Private: Needs Login
const getDocument = async (req, res) => {
  const { fileId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return res.status(404).json({ message: "Document not found" });
  }

  try {
    const storedDocument = await StoredDocument.findById(fileId);
    if (!storedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    const [client, employee, accountUser] = await Promise.all([
      Client.findOne({ $or: getClientDocumentFields(fileId) }),
      Employee.findOne({ $or: getEmployeeDocumentFields(fileId) }),
      User.findOne({ $or: getUserDocumentFields(fileId) }),
    ]);
    if ((!client && !employee && !accountUser) || !isDocumentOwner(req.user, client, employee, accountUser)) {
      return res.status(404).json({ message: "Document not found" });
    }

    const safeFilename = storedDocument.filename.replace(/[\r\n"\\]/g, "_");
    res.setHeader("Content-Type", storedDocument.contentType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(storedDocument.filename)}`
    );
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).send(storedDocument.data);
  } catch (err) {
    logger.error(
      `API /api/v1/document/file/${fileId} | MongoDB document read failed: ${err.message}`
    );
    return res.status(500).json({ message: "Unable to read document from MongoDB" });
  }
};

//@desc Delete a client or employee document from MongoDB
//@route DELETE /api/v1/document/delete/:client_id/:filename/:file_type
//@access Private: Needs Login
const deleteDocument = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const { filename, client_id: entityId, file_type: fileType } = req.params;

  if (!user) {
    return res.status(401).json({ message: "User is not authorized" });
  }
  if (!SUPPORTED_DOCUMENT_TYPES.has(fileType)) {
    return res.status(400).json({ message: "Unsupported document type" });
  }

  try {
    const urlIdField = `${fileType}_proof_url_id`;
    const urlField = `${fileType}_proof_url`;
    const proofField = `${fileType}_proof`;
    const selectors = [{ user_id: entityId }];
    if (mongoose.Types.ObjectId.isValid(entityId)) selectors.unshift({ _id: entityId });
    const recordQuery = { $and: [{ $or: selectors }, { [urlIdField]: filename }] };
    let record;
    let client;
    let employee;
    let accountUser;

    if (["asci", "bank"].includes(fileType)) {
      [employee, accountUser] = await Promise.all([
        Employee.findOne(recordQuery),
        User.findOne(recordQuery),
      ]);
      record = accountUser || employee;
    } else if (fileType === "adhar") {
      [client, employee, accountUser] = await Promise.all([
        Client.findOne(recordQuery),
        Employee.findOne(recordQuery),
        User.findOne(recordQuery),
      ]);
      record = accountUser || employee || client;
    } else {
      client = await Client.findOne(recordQuery);
      record = client;
    }

    if (!record) {
      return res.status(404).json({ message: "Document not found for this record" });
    }

    const role = user.roleType?.name || user.role;
    const isAdmin = ["admin", "super_admin"].includes(role);
    if (!isAdmin && !isDocumentOwner(user, client, employee, accountUser)) {
      return res.status(404).json({ message: "Document not found for this record" });
    }

    record[proofField] = false;
    record[urlField] = null;
    record[urlIdField] = null;
    await record.save();
    if (mongoose.Types.ObjectId.isValid(filename)) {
      await StoredDocument.findByIdAndDelete(filename);
    }

    logger.info(
      `${ip}: API /api/v1/document/delete | User: ${user.name || user.username || "Unknown"} | document deleted successfully`
    );
    return res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    logger.error(
      `${ip}: API /api/v1/document/delete | User: ${user.name || "Unknown"} | error deleting document: ${err.message}`
    );
    return res.status(500).json({ message: "Unable to delete document" });
  }
};

module.exports = {
  upload,
  testDocumentAPI,
  uploadDocument,
  uploadEmployeeDocument,
  uploadUserDocument,
  uploadClientDocument,
  getDocument,
  deleteDocument,
};
