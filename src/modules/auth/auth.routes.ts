import express from "express";
const router = express.Router();
import { validateRequest } from "../../shared/middleware/validateRequest.js";
import { registerBarbeShopSchema } from "./auth.dto.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { AuthRepository } from "./auth.repository.js";
import getDatabaseConnection from "../../shared/config/db.js";

const db = getDatabaseConnection();

const authRepository = new AuthRepository(db);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post(
    "/register",
    validateRequest(registerBarbeShopSchema),
    (req, res, next) => authController.registerUser(req, res, next),
);

export default router;
