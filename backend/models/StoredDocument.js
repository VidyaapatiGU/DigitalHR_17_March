const mongoose = require("mongoose");

const StoredDocumentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    documentType: { type: String, required: true },
    entityId: { type: String, required: true, index: true },
    uploadedBy: { type: String },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

StoredDocumentSchema.index({ entityId: 1, documentType: 1 });

module.exports = mongoose.model("StoredDocument", StoredDocumentSchema);
