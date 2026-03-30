import express from "express";

const router = express.Router();
import { EmployeeController } from "./employee.controller.js";
import { protect } from "../../shared/middleware/auth.js";
import { cacheMiddleware } from "../../shared/middleware/cache.js";
import getDatabaseConnection from "../../shared/config/db.js";
import { validateRequest } from "../../shared/middleware/validateRequest.js";
import { CreateEmployeeSchema, GetEmployeeSchema, ParamsSchema } from "./employee.dto.js";
import { EmployeeRepository } from "./employee.repository.js";
import { EmployeeService } from "./employee.service.js";

const db = getDatabaseConnection();

const employeeRepository = new EmployeeRepository(db);
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

router.get(
    "/options",
    protect,
    cacheMiddleware("employee"),
    (req, res, next) => employeeController.getEmployeeOptions(req, res, next),
);

router.get(
    "/",
    protect,
    validateRequest(GetEmployeeSchema, "query"),
    cacheMiddleware("employee"),
    (req, res, next) => employeeController.getEmployees(req, res, next),
);

router.post(
    "/",
    protect,
    validateRequest(CreateEmployeeSchema),
    (req, res, next) => employeeController.registerEmployee(req, res, next),
);

router.put(
    "/:id",
    protect,
    validateRequest(CreateEmployeeSchema),
    validateRequest(ParamsSchema, "params"),
    (req, res, next) => employeeController.updateEmployee(req, res, next),
);

router.delete(
    "/:id",
    protect,
    validateRequest(ParamsSchema, "params"),
    (req, res, next) => employeeController.deleteEmployee(req, res, next),
);

export default router;
