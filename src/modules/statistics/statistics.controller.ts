import asyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Response as ExpressResponse } from "express";
import { getAllStatistics } from "./statistics.model.js";

export const getAllStatisticsController = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) 
            throw new Error("Usuário não autenticado");

        const { month, year } = req.body;

        const { id } = req.user;

        const dataByService = await getAllStatistics({
            id,
            month,
            year,
        });

        res.status(200);
        res.json(dataByService);
    },
);
