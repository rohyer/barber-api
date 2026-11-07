import express from "express";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { getAllStatisticsController } from "./statistics.controller.js";
import { requirePremium } from "../../shared/middleware/require-premium.js";

const router = express.Router();

router.get("/", authenticate, requirePremium, getAllStatisticsController);

export default router;
