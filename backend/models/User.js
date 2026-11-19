const mongoose = require("mongoose");
const Department = require("../models/Department.js");
const Team = require("../models/Team.js");
const Role = require("../models/Role.js");

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  whatsapp_no: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pin_code: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  adhar_card: {
    type: Number,
    required: true,
    unique: true,
  },
  team: {
    type: "ObjectId",
    ref: Team,
  },
  department: {
    type: "ObjectId",
    ref: Department,
  },
  roleType: {
    type: "ObjectId",
    ref: Role,
  },
  client_id: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  profile_url: {
    type: String,
  },
  adhar_proof: { type: Boolean, default: false },
  adhar_proof_url: { type: String, default: null },
  adhar_proof_url_id: { type: String, default: null },
  asci_proof: { type: Boolean, default: false },
  asci_proof_url: { type: String, default: null },
  asci_proof_url_id: { type: String, default: null },
  bank_proof: { type: Boolean, default: false },
  bank_proof_url: { type: String, default: null },
  bank_proof_url_id: { type: String, default: null },
});

module.exports = mongoose.model("User", UserSchema);

//RoleType:
//super_admin //Highest Priority 1
//admin //Priority 2
//user //Priority 3
//customer //Business   //Priority 4
//employee //Priority 5
