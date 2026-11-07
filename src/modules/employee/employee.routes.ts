import express from "express";

const router = express.Router();
import { EmployeeController } from "./employee.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { cacheResponse } from "../../shared/middleware/cache-response.js";
import getDatabaseConnection from "../../shared/config/db.js";
import { validateRequest } from "../../shared/middleware/validate-request.js";
import { CreateEmployeeSchema, GetEmployeeSchema, ParamsSchema } from "./employee.dto.js";
import { EmployeeRepository } from "./employee.repository.js";
import { EmployeeService } from "./employee.service.js";

const db = getDatabaseConnection();

const employeeRepository = new EmployeeRepository(db);
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

router.get(
    "/options",
    authenticate,
    cacheResponse("employee"),
    (req, res, next) => employeeController.getEmployeeOptions(req, res, next),
);

router.get(
    "/",
    authenticate,
    validateRequest(GetEmployeeSchema, "query"),
    cacheResponse("employee"),
    (req, res, next) => employeeController.getEmployees(req, res, next),
);

router.post(
    "/",
    authenticate,
    validateRequest(CreateEmployeeSchema),
    (req, res, next) => employeeController.registerEmployee(req, res, next),
);

router.put(
    "/:id",
    authenticate,
    validateRequest(CreateEmployeeSchema),
    validateRequest(ParamsSchema, "params"),
    (req, res, next) => employeeController.updateEmployee(req, res, next),
);

router.delete(
    "/:id",
    authenticate,
    validateRequest(ParamsSchema, "params"),
    (req, res, next) => employeeController.deleteEmployee(req, res, next),
);

export default router;
