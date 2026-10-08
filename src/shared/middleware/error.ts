import { AuthenticatedRequest } from "../types/express.type.js";
import { Response as ExpressResponse, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
    error: ApiError,
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction,
) => {
    if (res.headersSent) 
        return next(error);

    if (error instanceof ApiError) {
        return res.status(error.status).json({
            error: {
                message: error.message,
            },
        });
    }

    return res.status(500).json({
        error: {
            message: "Erro interno do servidor.",
        },
    });
};
