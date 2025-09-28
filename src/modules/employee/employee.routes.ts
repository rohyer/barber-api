import express from "express";

const router = express.Router();
import {
    getEmployees,
    setEmployee,
    updateEmployee,
    deleteEmployee,
} from "./employee.controller.js";
import { protect } from "../../shared/middleware/auth.js";
import { cacheMiddleware } from "../../shared/middleware/cache.js";

router.get("/", protect, cacheMiddleware("employee"), getEmployees);

router.post("/", protect, setEmployee);

router.put("/:id", protect, updateEmployee);

router.delete("/:id", protect, deleteEmployee);

export default router;
