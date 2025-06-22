import express from "express";
import { protect } from "../../shared/middleware/auth-middleware.js";
import { getAllStatisticsController } from "./statistics.controller.js";
import { protectPremium } from "../../shared/middleware/auth-premium.js";

const router = express.Router();

router.get("/", protect, protectPremium, getAllStatisticsController);

export default router;
