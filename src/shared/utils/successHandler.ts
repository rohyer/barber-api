import { Response as ExpressResponse } from "express";

export type SuccessHandler = {
    status: number;
    message: string;
    data: any;
};

export const successHandler = (
    res: ExpressResponse,
    { data, message, status = 200 }: SuccessHandler,
) => {
    res.status(status).json({
        success: true,
        message,
        data,
    });
};
