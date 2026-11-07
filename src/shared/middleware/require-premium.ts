import asyncHandler from "express-async-handler";
import { Response as ExpressResponse } from "express";
import { AuthenticatedRequest } from "../types/express.type.js";
import UserModel from "../../modules/user/user.model.js";
import { ForbiddenError, UnauthorizedError } from "../utils/ApiError.js";

export const requirePremium = asyncHandler(
    async (req: AuthenticatedRequest, _res: ExpressResponse, next) => {
        if (!req.user)
            throw new UnauthorizedError("Usuário não autenticado.");

        const [user] = await UserModel.getUserById(req.user.id);

        if (!user)
            throw new UnauthorizedError("Usuário não encontrado");

        if (user.status === 0 || !user.premiumExpiresAt)
            throw new ForbiddenError("Este recurso é exclusivo para usuário premium.");

        if (user.premiumExpiresAt < new Date()) {
            await UserModel.removePremiumAccess(null, req.user.id);
            throw new ForbiddenError("Seu acesso premium expirou");
        }

        console.log(new Date(user.premiumExpiresAt).toISOString());
        console.log(new Date().toISOString());

        next();
    },
);
