import express from "express";
const router = express.Router();
import { validateRequest } from "../../../shared/middleware/validateRequest.js";
import { loginBarbershopSchema, registerBarbershopInputSchema } from "./auth.request.dto.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "../auth.service.js";
import { AuthRepository } from "../auth.repository.js";
import getDatabaseConnection from "../../../shared/config/db.js";
import { JwtService } from "../jwt.service.js";
import { HashService } from "../hash.service.js";
import { authMe } from "../auth.middleware.js";

const db = getDatabaseConnection();

const jwtService = new JwtService();
const hashService = new HashService();

const authRepository = new AuthRepository(db);
const authService = new AuthService(authRepository, jwtService, hashService);
const authController = new AuthController(authService);

router.post(
    "/register",
    validateRequest(registerBarbershopInputSchema),
    (req, res, next) => authController.registerUser(req, res, next),
);

router.post(
    "/login",
    validateRequest(loginBarbershopSchema),
    (req, res, next) => authController.loginUser(req, res, next),
);

router.post(
    "/me",
    authMe,
    (req, res, next) => authController.me(req, res, next),
);

export default router;
