import "./shared/config/env.js";
import express from "express";
import connectionDB from "./shared/config/db.js";
import { confirmEmailChange } from "./modules/user/user.controller.js";

import userRouter from "./modules/user/user.routes.js";
import serviceRouter from "./modules/service/service.routes.js";
import employeeRouter from "./modules/employee/employee.routes.js";
import clientRouter from "./modules/client/client.routes.js";
import customerServiceRouter from "./modules/customer-service/customer-service.routes.js";

const port = process.env.PORT || 5000;

connectionDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRouter);

app.use("/api/services", serviceRouter);

app.use("/api/employees", employeeRouter);

app.use("/api/clients", clientRouter);

app.use("/api/customer-services", customerServiceRouter);

app.get("/confirm-email-change", confirmEmailChange);

app.listen(port, () =>
  console.log(`Instance ${process.env.APP_NAME} started on port ${port}`),
);
