import asyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Response as ExpressResponse } from "express";
import { successHandler } from "../../shared/utils/successHandler.js";
import { OfferingService } from "./offering.service.js";

export class OfferingController {
    constructor(private offeringService: OfferingService) {};

    getOfferings = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const data = await this.offeringService.getOfferings({
            ...req.query,
            idAdmin: req.user!.id,
            cacheKey: req.cacheKey,
        });

        const responseData = {
            status: 200,
            message: "Clientes listados com sucesso.",
            fromCache: false,
            data,
        };
        
        return successHandler(res, responseData);
    });

    registerOffering = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const data = await this.offeringService.registerOffering({
            ...req.body,
            idAdmin: req.user!.id,
        });

        const responseData = {
            status: 201,
            message: "Serviço cadastrado com sucesso.",
            fromCache: false,
            data,
        };

        return successHandler(res, responseData);
    });

    updateService = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const data = await this.offeringService.updateOffering({
            ...req.body,
            id: req.params.id,
            idAdmin: req.user!.id,
        });

        const responseData = {
            status: 200,
            message: "Serviço editado com sucesso",
            fromCache: false,
            data,
        };

        return successHandler(res, responseData);
    });

    deleteService = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const isDeletedClient = await this.offeringService.deleteOffering({
            id: req.params.id,
            idAdmin: req.user!.id,
        });

        if (!isDeletedClient)
            throw new Error("Erro ao deletar serviço");

        const responseData = {
            status: 200,
            message: "Serviço deletado com sucesso",
            fromCache: false,
            data: {
                id: req.params.id,
            },
        };

        return successHandler(res, responseData);

        const service = await ServiceModel.getServiceById(req.params.id);

        if (service.length === 0) {
            res.status(400);
            throw new Error("Serviço não encontrado");
        }

        if (service[0].id_admin !== req.user.id) {
            res.status(401);
            throw new Error("Usuário não autorizado");
        }

        const deletedService = await ServiceModel.deleteService(Number(req.params.id), req.user.id);

        res.status(200).json({
            success: true,
            message: "Serviço deletado com sucesso",
            data: {
                id: req.params.id,
                affectedRows: deletedService.affectedRows,
            },
        });
    });

}