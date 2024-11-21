const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectionDB = require("./config/db");
const port = process.env.PORT || 5000;

connectionDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/services", require("./routes/serviceRoutes"));

app.use("/api/employees", require("./routes/employeeRoutes"));

app.use("/api/clients", require("./routes/clientRoutes"));

app.listen(port, () => console.log(`Server started on port ${port}`));
