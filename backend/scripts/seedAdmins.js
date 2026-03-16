/* Seed predefined admins into the Admin collection.
 * Usage: NODE_ENV=development node scripts/seedAdmins.js
 * Requires: MONGOURL in backend/.env
 */
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectToMongo = require("../config/db");
const Admin = require("../models/Admin");

const seedAdmins = async () => {
  await connectToMongo();

  const defaults = [
    {
      username: "superadmin",
      name: "Default Super Admin",
      email: "superadmin@example.com",
      password: "Admin@123", // will be hashed
      role: "super_admin",
    },
    {
      username: "admin",
      name: "Default Admin",
      email: "admin@example.com",
      password: "Admin@123",
      role: "admin",
    },
  ];

  for (const admin of defaults) {
    let doc = await Admin.findOne({ username: admin.username });
    if (doc) {
      doc.name = admin.name;
      doc.email = admin.email;
      doc.role = admin.role;
      doc.active = true;
      doc.password = admin.password; // plain; model hook will hash if needed
      await doc.save();
      console.log(`Updated admin ${admin.username}`);
    } else {
      await Admin.create({ ...admin }); // pre-save hook will hash password
      console.log(`Created admin ${admin.username}`);
    }
  }

  console.log("Admin seed complete");
  process.exit(0);
};

seedAdmins().catch((err) => {
  console.error("Admin seed failed", err);
  process.exit(1);
});
