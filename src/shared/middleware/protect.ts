import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express.type.js";
import { AUTH } from "../../modules/auth/auth.constants.js";
import { NextFunction, Response } from "express";
import { JwtService } from "../../modules/auth/jwt.service.js";

const jwtService = new JwtService();

export const protect = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const token = req.cookies[AUTH.COOKIE_NAME];

        if (!token) {
            res.status(401).json({ message: "Usuário não autenticado" });
            return;
        }

        if (!process.env.JWT_SECRET) 
            throw new Error("JWT_SECRET não definido!");

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

            req.user = { id: payload.id };

            const newToken = jwtService.generateToken(payload.id);

            res.cookie(AUTH.COOKIE_NAME, newToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: AUTH.MAX_AGE_7_DAYS,
            });

            next();
        } catch (error) {
            res.clearCookie(AUTH.COOKIE_NAME);

            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ message: "Sessão expirada" });
                return;
            }

            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ message: "Token inválido" });
                return;
            }

            res.status(401).json({ message: "Usuário não autenticado" });
        }
    },
);
