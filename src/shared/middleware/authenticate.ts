import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express.type.js";
import { AUTH } from "../../modules/auth/auth.constants.js";
import { NextFunction, Response } from "express";
import { JwtService } from "../../modules/auth/jwt.service.js";
import { UnauthorizedError } from "../utils/ApiError.js";

const jwtService = new JwtService();

export const authenticate = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const token = req.cookies[AUTH.COOKIE_NAME];

        if (!token)
            throw new UnauthorizedError("Usuário não autenticado.");

        if (!process.env.JWT_SECRET) 
            throw new Error("JWT_SECRET não definido.");

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            if (typeof payload === "string" || typeof payload.id !== "number")
                throw new UnauthorizedError("Token inválido.");

            req.user = { id: payload.id };

            const newToken = jwtService.generateToken(payload.id);

            res.cookie(AUTH.COOKIE_NAME, newToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: AUTH.MAX_AGE_7_DAYS,
            });
        } catch (error) {
            res.clearCookie(AUTH.COOKIE_NAME);

            if (error instanceof jwt.TokenExpiredError)
                throw new UnauthorizedError("Sessão expirada.");

            if (error instanceof jwt.JsonWebTokenError)
                throw new UnauthorizedError("Token inválido.");

            throw new UnauthorizedError("Usuário não autenticado.");
        }

        next();
    },
);
