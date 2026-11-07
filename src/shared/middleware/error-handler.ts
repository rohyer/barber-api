import {
    ErrorRequestHandler,
    Response as ExpressResponse,
    Request as ExpressRequest,
    NextFunction,
} from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler: ErrorRequestHandler = (
    error: ApiError,
    _req: ExpressRequest,
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
                message: error.message,
            },
        });
        return;
    }

    res.status(500).json({
        error: {
            message: "Erro interno do servidor.",
        },
    });
};
