const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectionDB = require("./config/db");
const port = process.env.PORT || 5000;
const { confirmEmailChange } = require("./controllers/userController");

connectionDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/services", require("./routes/serviceRoutes"));

app.use("/api/employees", require("./routes/employeeRoutes"));

app.use("/api/clients", require("./routes/clientRoutes"));

app.use("/api/customer-services", require("./routes/customerServiceRoutes"));

app.get("/confirm-email-change", confirmEmailChange);

app.listen(port, () =>
  console.log(`Instance ${process.env.APP_NAME} started on port ${port}`)
);
