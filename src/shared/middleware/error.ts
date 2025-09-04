import { AuthenticatedRequest } from "../types/express.type.js";
import { Response as ExpressResponse, NextFunction } from "express";
import { CreateError } from "../utils/createError.js";

export const errorHandler = (
    error: CreateError,
    req: AuthenticatedRequest,
    res: ExpressResponse,
    _next: NextFunction,
) => {
    const status = error.status || 500;

    res.status(status).json({
        error: error.name,
        message: error.message,
        status,
    });
};
