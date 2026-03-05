import express from "express";

const router = express.Router();
import { EmployeeController } from "./employee.controller.js";
import { protect } from "../../shared/middleware/auth.js";
import { cacheMiddleware } from "../../shared/middleware/cache.js";
import getDatabaseConnection from "../../shared/config/db.js";
import { validateRequest } from "../../shared/middleware/validateRequest.js";
import { GetEmployeeSchema } from "./employee.dto.js";
import { EmployeeRepository } from "./repository/employee.repository.js";
import { EmployeeService } from "./service/employee.service.js";

const db = getDatabaseConnection();

const employeeRepository = new EmployeeRepository(db);
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

router.get(
    "/",
    protect,
    validateRequest(GetEmployeeSchema, "query"),
    cacheMiddleware("employee"),
    (req, res, next) => employeeController.getEmployees(req, res, next),
);

router.post("/", protect, employeeController.registerEmployee);

router.put("/:id", protect, employeeController.updateEmployee);

router.delete("/:id", protect, employeeController.deleteEmployee);

export default router;
