import asyncHandler from "express-async-handler";
import CustomerServiceModel from "./customer-service.model.js";
import redisClient from "../../shared/config/redis-client.js";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Response as ExpressResponse } from "express";

/**
 * @description Get all customer services
 * @route       GET /api/customer-services
 * @access      Private
 */
export const getCustomerServices = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) {
            res.status(401);
            throw new Error("Usuário não autenticado!");
        }

        const customerServices = await CustomerServiceModel.getCustomerServices(req.user.id);

        if (req.cacheKey) {
            await redisClient.set(req.cacheKey, JSON.stringify(customerServices), {
                EX: 120,
            });
        }

        res.status(200).json(customerServices);
    },
);

/**
 * @description Register customer service
 * @route       POST /api/customer-services
 * @access      Private
 */
export const setCustomerService = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) {
            res.status(401);
            throw new Error("Usuário não autenticado!");
        }

        const { date, time, idService, idClient, idEmployee } = req.body;

        if (!date || !time || !idService || !idClient || !idEmployee) {
            res.status(400);
            throw new Error("Por favor, preencha os campos");
        }

        const customerServiceData = {
            date,
            time,
            idService,
            idClient,
            idEmployee,
            idAdmin: req.user.id,
        };

        const result = await CustomerServiceModel.createCustomerService(customerServiceData);

        res.status(201);
        res.json({
            success: true,
            message: "Agendamento cadastrado com sucesso!",
            data: {
                id: result.insertId,
            },
        });
    },
);

/**
 * @description Update customer service
 * @route       PUT /api/customer-services/:id
 * @access      Private
 */
export const updateCustomerService = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) {
            res.status(400);
            throw new Error("Usuário não encontrado!");
        }

        const { date, time, idService, idClient, idEmployee } = req.body;

        const customerServiceExists = await CustomerServiceModel.getCustomerServiceById(
            Number(req.params.id),
        );

        if (customerServiceExists.length === 0) {
            res.status(400);
            throw new Error("Atendimento não encontrado!");
        }

        if (customerServiceExists[0].id_admin !== req.user.id) {
            res.status(400);
            throw new Error("Usuário não autorizado!");
        }

        const customerServiceData = {
            date,
            time,
            idService,
            idClient,
            idEmployee,
            id: Number(req.params.id),
            idAdmin: req.user.id,
        };

        const result = await CustomerServiceModel.updateCustomerService(customerServiceData);

        res.status(200);
        res.json({
            success: true,
            message: "Agendamento atualizado com sucesso!",
            data: {
                affectedRows: result.affectedRows,
            },
        });
    },
);

/**
 * @description Delete customer service
 * @route       DELETE /api/customer-services/:id
 * @access      Private
 */
export const deleteCustomerService = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) {
            res.status(400);
            throw new Error("Usuário não encontrado!");
        }

        const customerServiceExists = await CustomerServiceModel.getCustomerServiceById(
            Number(req.params.id),
        );

        if (customerServiceExists.length === 0) {
            res.status(400);
            throw new Error("Atendimento não encontrado!");
        }

        if (customerServiceExists[0].id_admin !== req.user.id) {
            res.status(400);
            throw new Error("Usuário não autorizado!");
        }

        const deletedCustomerService = await CustomerServiceModel.deleteCustomerService(
            Number(req.params.id),
            req.user.id,
        );

        res.status(200);
        res.json({
            success: true,
            message: "Agendamento deletado com sucesso",
            data: {
                id: req.params.id,
                affectedRows: deletedCustomerService.affectedRows,
            },
        });
    },
);
