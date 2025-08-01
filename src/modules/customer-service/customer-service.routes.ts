import express from "express";
const router = express.Router();
import {
    getCustomerServices,
    setCustomerService,
    updateCustomerService,
    deleteCustomerService,
} from "./customer-service.controller.js";
import { protect } from "../../shared/middleware/auth.js";
import { cacheMiddleware } from "../../shared/middleware/cache.js";

router.get("/", protect, cacheMiddleware, getCustomerServices);

router.post("/", protect, setCustomerService);

router.put("/:id", protect, updateCustomerService);

router.delete("/:id", protect, deleteCustomerService);

export default router;
