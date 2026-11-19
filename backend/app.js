const express = require("express");
const cors = require("cors");
const logger = require("./config/logger.js");
const connectToMongo = require("./config/db.js");
const bodyParser = require("body-parser");
const path = require("path");

const envPath =
  process.env.DOTENV_CONFIG_PATH || path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

connectToMongo();

const app = express();
app.use(bodyParser.json({ limit: "30mb" })); // Set the limit as needed
app.use(express.json());

// CORS: allow local dev and general use
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
const port = process.env.PORT || 5001;

//@desc Test Backend API
//@route GET /api/v1/
//@access Public
app.get("/api/v1/", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  res.status(200).send("Welcome to Backend API for DigitalHR");
  logger.info(
    `${ip}: API /api/v1/ responnded with "Welcome to Backend API for DigitalHR" `
  );
});

//Routes
app.use("/api/v1/user", require("./routes/user.js"));
app.use("/api/v1/team", require("./routes/team.js"));
app.use("/api/v1/department", require("./routes/department.js"));
app.use("/api/v1/role", require("./routes/role.js"));
app.use("/api/v1/notification", require("./routes/notification.js"));
app.use("/api/v1/client", require("./routes/client.js"));
app.use("/api/v1/document", require("./routes/document.js"));
app.use("/api/v1/employee", require("./routes/employee.js"));
app.use("/api/v1/attendance", require("./routes/attendance.js"));
app.use("/api/v1/holiday", require("./routes/holidays.js"));
app.use("/api/v1/settings", require("./routes/settings.js"));
app.use("/api/v1/esic-report", require("./routes/esicReport.js"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
