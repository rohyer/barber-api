import redisClient from "../config/redis-client.js";
import { AuthenticatedRequest } from "../types/express.type.js";
import { Response as ExpressResponse, NextFunction } from "express";
import { successHandler } from "../utils/successHandler.js";

export const cacheMiddleware = (prefix: string) => {
    return async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
        if (!req.user) {
            res.status(401);
            throw new Error("Usuário não autenticado!");
        }

        const offset = req.query.offset ?? 0;
        const query = req.query.query ?? "";

        const cacheKey = `${prefix}:user:${req.user.id}:offset:${offset}:query:${query}`;

        try {
            const cachedData = await redisClient.get(cacheKey);

            req.cacheKey = cacheKey;

            if (cachedData) {
                successHandler(res, {
                    status: 200,
                    message: "Requisição feita com sucesso CACHE",
                    fromCache: true,
                    data: JSON.parse(cachedData),
                });
            }

            next();
        } catch (error) {
            console.error(`Erro ao verificar o cache ${prefix}`, error);
            next();
        }
    };
};
