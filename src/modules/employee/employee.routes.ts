import express from "express";

const router = express.Router();
import {
  getEmployees,
  setEmployee,
  updateEmployee,
  deleteEmployee,
} from "./employee.controller.js";
import { protect } from "../../shared/middleware/auth-middleware.js";
import { cacheMiddleware } from "../../shared/middleware/cache-middleware.js";

router.get("/", protect, cacheMiddleware, getEmployees);

router.post("/", protect, setEmployee);

router.put("/:id", protect, updateEmployee);

router.delete("/:id", protect, deleteEmployee);

export default router;
