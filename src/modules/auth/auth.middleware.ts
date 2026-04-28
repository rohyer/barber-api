import asyncHandler from "express-async-handler";
import { AUTH } from "./auth.constants.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";

export const authMe = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies[AUTH.COOKIE_NAME];

    if (!token) {
        res.status(401).json({ message: "Não encontrado" });
        return;
    }

    try {
        if (!process.env.JWT_SECRET) 
            throw new Error("JWT_SECRET não definido!");

        const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        req.user = {
            id: payload.id,
        };

        next();
    } catch {
        res.clearCookie(AUTH.COOKIE_NAME);

        res.status(401).json({ message: "Token inválido ou expirado" });
    }
});