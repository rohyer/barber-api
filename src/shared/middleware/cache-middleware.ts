import redisClient from "../config/redis-client.js";
import { AuthenticatedRequest } from "../types/express.type.js";
import { Response as ExpressResponse, NextFunction } from "express";

export const cacheMiddleware = async (
  req: AuthenticatedRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Usuário não autenticado!");
  }

  // const id = req.params.id;
  const prefix = req.originalUrl.split("/");
  const cacheKey = `${prefix[prefix.length - 1]}:user:${req.user.id}`;

  try {
    const cachedData = await redisClient.get(cacheKey);

    req.cacheKey = cacheKey;

    if (cachedData) {
      console.log(`Resposta do cache para ${cachedData}`);
      res.json(JSON.parse(cachedData));
    }

    // Continua para a lógica principal se não houver cache
    next();
  } catch (error) {
    console.error(`Erro ao verificar o cache ${prefix}`, error);
    next();
  }
};
