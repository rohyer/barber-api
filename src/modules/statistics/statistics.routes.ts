import express from "express";
import { protect } from "../../shared/middleware/auth-middleware.js";
import { getAllStatisticsController } from "./statistics.controller.js";

const router = express.Router();

router.get("/", protect, getAllStatisticsController);

export default router;
