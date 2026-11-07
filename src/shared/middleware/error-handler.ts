import {
    ErrorRequestHandler,
    Response as ExpressResponse,
    Request as ExpressRequest,
    NextFunction,
} from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler: ErrorRequestHandler = (
    error: ApiError,
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction,
): void | Promise<void> => {
    if (res.headersSent) {
        next(error);
        return;
    }

    if (error instanceof ApiError) {
        res.status(error.status).json({
            error: {
                success: false,
                message: error.message,
            },
        });
        return;
    }

    console.error(`[${req.method}] ${req.originalUrl}`, error);

    res.status(500).json({
        error: { message: "Erro interno do servidor." },
    });
};
