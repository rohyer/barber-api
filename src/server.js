const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectionDB = require("./config/db");
const port = process.env.PORT || 5000;
const { confirmEmailChange } = require("./modules/user/user.controller");

connectionDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./modules/user/user.routes"));

app.use("/api/services", require("./modules/service/service.routes"));

app.use("/api/employees", require("./modules/employee/employee.routes"));

app.use("/api/clients", require("./modules/client/client.routes"));

app.use("/api/customer-services", require("./modules/customer-service/customerService.routes"));

app.get("/confirm-email-change", confirmEmailChange);

app.listen(port, () =>
  console.log(`Instance ${process.env.APP_NAME} started on port ${port}`)
);
