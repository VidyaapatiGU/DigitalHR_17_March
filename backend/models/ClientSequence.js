const mongoose = require("mongoose");

const ClientSequenceSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "client" },
    sequence: { type: Number, required: true, default: 0 },
  },
  { versionKey: false }
);

module.exports = mongoose.model("ClientSequence", ClientSequenceSchema);
