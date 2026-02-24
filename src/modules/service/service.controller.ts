import asyncHandler from "express-async-handler";
import ServiceModel from "./service.model.js";
import redisClient from "../../shared/config/redis-client.js";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Response as ExpressResponse } from "express";

/**
 * @description Get services
 * @route       GET /api/services
 * @access      Private
 */
export const getServices = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Usuário não autenticado!");
    }

    const result = await ServiceModel.getServices(req.user.id);

    if (req.cacheKey) 
        await redisClient.set(req.cacheKey, JSON.stringify(result), { EX: 300 });

    res.status(200).json(result);
});

/**
 * @description Set services
 * @route       POST /api/services
 * @access      Private
 */
// Precisar passar no protect? req.user.id?
export const setService = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Usuário não autenticado");
    }

    const { name, value } = req.body;

    // Verifica se os campos foram preenchidos
    if (!name || !value) {
        res.status(400);
        throw new Error("Por favor, preencha os campos corretamente");
    }

    // Verifica se o serviço já existe
    const serviceExists = await ServiceModel.getServiceByName(name);

    if (serviceExists.length > 0) {
        res.status(400);
        throw new Error("Serviço já existe");
    }

    const serviceData = { name, value, idAdmin: req.user.id };

    // Faz o cadastro no Banco de Dados
    const result = await ServiceModel.createService(serviceData);

    res.status(201).json({
        message: "Serviço criado",
        id: result.insertId,
    });
});

/**
 * @description Update services
 * @route       PUT /api/services/:id
 * @access      Private
 */
export const updateService = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) {
            res.status(400);
            throw new Error("Usuário não encontrado");
        }

        const { name, value } = req.body;

        if (!name || !value) {
            res.status(400);
            throw new Error("Por favor, preencha os campos corretamente");
        }

        const service = await ServiceModel.getServiceById(req.params.id);

        if (service.length === 0) {
            res.status(400);
            throw new Error("Serviço não encontrado");
        }

        if (service[0].id_admin !== req.user.id) {
            res.status(400);
            throw new Error("Usuário não autorizado");
        }

        const serviceData = {
            name,
            value,
            id: Number(req.params.id),
            idAdmin: req.user.id,
        };

        const result = await ServiceModel.updateService(serviceData);

        res.status(200);
        res.json({
            success: true,
            message: "Serviço atualizado com sucesso!",
            data: {
                affectedRows: result.affectedRows,
            },
        });
    },
);

/**
 * @description Delete services
 * @route       DELETE /api/services/:id
 * @access      Private
 */
export const deleteService = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) {
            res.status(400);
            throw new Error("Usuário não encontrado");
        }

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
    },
);
