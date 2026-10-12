const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const { validationResult, matchedData } = require("express-validator");

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Client = require("../models/Client");

const logger = require("../config/logger.js");

const secret = process.env.ACCESS_TOKEN_SECERT;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-north-1",
  endpoint: "s3.eu-north-1.amazonaws.com",
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const upload = multer({ storage: multer.memoryStorage() });

//@desc Test Document API
//@route GET /api/v1/documemt
//@access Private: Needs Login
const testDocumentAPI = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;

  if (user) {
    logger.info(
      `${ip}: API /api/v1/client | User:  ${user.name}| responnded with "Client API Test Successfully" `
    );
    return res.status(200).send("Document API Test Successfully");
  } else {
    logger.error(
      `${ip}: API /api/v1/client | User: ${user.name} | responnded with Client is not Autherized `
    );
    return res.status(401).send({ message: "Client is not Autherized" });
  }
};

//@desc Upload document
//@route POST /api/v1/document/upload/
//@access Private: Needs Login
const uploadDocument = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const { document, id } = req.params;

  const supportedDocumentTypes = new Set(["pan", "adhar", "gst", "cin", "asci", "bank"]);

  if (!user) {
    logger.error(
      `${ip}: API /api/v1/document/upload | User: ${user.name} | responnded with User is not Autherized `
    );
    return res.status(401).send({ message: "User is not Autherized" });
  }

  try {
    const file = req.file;
    if (!supportedDocumentTypes.has(document)) {
      return res.status(400).json({ message: "Unsupported document type" });
    }

    if (!file || !file.originalname || !file.buffer) {
      return res.status(400).json({ message: "Select a document to upload" });
    }
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.mimetype)) {
      return res.status(400).json({ message: "Only PDF, JPEG, or PNG files are supported" });
    }
    if (file.size > 10 * 1024 * 1024) {
      return res.status(413).json({ message: "Documents must be 10 MB or smaller" });
    }

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `documents/${document + id + file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(uploadParams).promise();

    res.setHeader("Content-Disposition", "");

    logger.info(
      `${ip}: API /api/v1/document/upload | User:  ${user.name}| document uploaded successfully`
    );
    return res
      .status(201)
      .json({ location: data, file_id: document + id + file.originalname });
  } catch (err) {
    logger.error(
      `${ip}: API /api/v1/document/upload | User: ${user.name} | error uploading document: ${err.message}`
    );
    return res.status(500).json({
      message: "Document storage is unavailable. Please verify the storage configuration and retry.",
    });
  }
};

// @description Upload document
// @route POST /api/v1/document/upload/
// @access Private: Needs Login

const deleteDocument = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const user = req.user;
  const { filename, client_id, file_type } = req.params;

  if (!user) {
    return res.status(401).json({ message: "User is not authorized" });
  }
  if (!["pan", "adhar", "gst", "cin"].includes(file_type)) {
    return res.status(400).json({ message: "Unsupported document type" });
  }

  const file_proof = `${file_type}_proof`;
  const file_proof_url = `${file_type}_proof_url`;
  const file_proof_url_id = `${file_type}_proof_url_id`;

  try {
    const selectors = [{ user_id: client_id }];
    if (/^[a-f\d]{24}$/i.test(client_id)) selectors.unshift({ _id: client_id });
    const client = await Client.findOne({ $or: selectors });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    if (client[file_proof_url_id] !== filename) {
      return res.status(404).json({ message: "Document not found for this client" });
    }

    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `documents/${filename}`,
    }).promise();
    await Client.findByIdAndUpdate(client._id, {
      [file_proof]: false,
      [file_proof_url]: null,
      [file_proof_url_id]: null,
    });

    logger.info(
      `${ip}: API /api/v1/document/delete | User: ${user.name} | document deleted successfully`
    );
    return res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    logger.error(
      `${ip}: API /api/v1/document/delete | User: ${user?.name || "Unknown"} | error deleting document: ${err.message}`
    );
    return res.status(500).json({ message: "Unable to delete document" });
  }
};

module.exports = {
  testDocumentAPI,
  uploadDocument,
  deleteDocument,
};
