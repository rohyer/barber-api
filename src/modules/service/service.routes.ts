import express from "express";
const router = express.Router();
import { protect } from "../../shared/middleware/auth.js";
import { cacheMiddleware } from "../../shared/middleware/cache.js";
import { getServices, setService, updateService, deleteService } from "./service.controller.js";

router.get("/", protect, cacheMiddleware, getServices);

router.post("/", protect, setService);

router.put("/:id", protect, updateService);

router.delete("/:id", protect, deleteService);

export default router;
