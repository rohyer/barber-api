import { Response as ExpressResponse } from "express";

export type SuccessHandler = {
    status: number;
    message: string;
    fromCache: boolean;
    data: any;
};

export const successHandler = (
    res: ExpressResponse,
    { data, message, fromCache, status = 200 }: SuccessHandler,
) => {
    res.status(status).json({
        success: true,
        message,
        fromCache,
        data,
    });
};
