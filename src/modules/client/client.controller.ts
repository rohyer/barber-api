import asyncHandler from "express-async-handler";
import ClientModel from "./client.model.js";
import redisClient from "../../shared/config/redis-client.js";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Response as ExpressResponse, NextFunction } from "express";
import { createError } from "../../shared/utils/createError.js";
import { successHandler } from "../../shared/utils/successHandler.js";

/**
 * @description Get all clients
 * @route       GET /api/clients
 * @access      Private
 */
export const getClients = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse, _next: NextFunction) => {
        if (!req.user) {
            const error = {
                name: "UserNotAuthenticated",
                message: "Usuário não autenticado.",
                status: 401,
            };

            throw createError(error);
        }

        const { offset, query } = req.query;

        const data = await ClientModel.getClients(req.user.id, offset as string, query as string);

        if (req.cacheKey) await redisClient.set(req.cacheKey, JSON.stringify(data), { EX: 300 });

        const responseData = {
            status: 200,
            message: "Clientes listados com sucesso.",
            fromCache: false,
            data,
        };

        successHandler(res, responseData);
    },
);

/**
 * @description Get all clients
 * @route       GET /api/clients/options
 * @access      Private
 */
export const getClientsByName = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse, _next: NextFunction) => {
        if (!req.user) {
            const error = {
                name: "UserNotAuthenticated",
                message: "Usuário não autenticado.",
                status: 401,
            };

            throw createError(error);
        }

        const { offset, query } = req.query;

        const data = await ClientModel.getClientsByName(
            req.user.id,
            offset as string,
            query as string,
        );

        if (req.cacheKey) await redisClient.set(req.cacheKey, JSON.stringify(data), { EX: 300 });

        const responseData = {
            status: 200,
            message: "Clientes listados com sucesso.",
            fromCache: false,
            data,
        };

        successHandler(res, responseData);
    },
);

/**
 * @description Register client
 * @route       POST /api/clients
 * @access      Private
 */
export const registerClient = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) {
            res.status(401);
            throw new Error("Usuário não autenticado!");
        }

        const { name, sex, phone, address, birth } = req.body;

        if (!name || !sex || !phone || !address || !birth) {
            const error = {
                name: "UnfilledFields",
                message: "Por favor, preencha os campos.",
                status: 400,
            };

            throw createError(error);
        }

        const clientData = {
            name,
            sex,
            phone,
            address,
            birth,
            idAdmin: req.user.id,
        };

        const result = await ClientModel.createClient(clientData);

        const cacheKeys = await redisClient.keys(`client:user:${req.user.id}:*`);

        if (cacheKeys.length > 0) await redisClient.del(cacheKeys);

        const responseData = {
            status: 201,
            message: "Cliente cadastrado com sucesso.",
            fromCache: false,
            data: { ...result },
        };

        successHandler(res, responseData);
    },
);

/**
 * @description Update client
 * @route       PUT /api/clients/:id
 * @access      Private
 */
export const updateClient = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const { name, sex, phone, address, birth } = req.body;

        if (!name || !sex || !phone || !address || !birth) {
            res.status(400);
            throw new Error("Por favor, preencha todos os campos!");
        }

        const clientExists = await ClientModel.getClientById(Number(req.params.id));

        if (!clientExists || clientExists.length === 0) {
            res.status(400);
            throw new Error("Cliente não encontrado!");
        }

        if (!req.user) {
            res.status(400);
            throw new Error("Usuário não encontrado!");
        }

        if (clientExists[0].idAdmin !== Number(req.user.id)) {
            res.status(400);
            throw new Error("Usuário não autorizado!");
        }

        const clientData = {
            id: Number(req.params.id),
            name,
            sex,
            phone,
            address,
            birth,
            idAdmin: req.user.id,
        };

        await ClientModel.updateClient(clientData);

        const cacheKeys = await redisClient.keys(`client:user:${req.user.id}:*`);

        if (cacheKeys.length > 0) await redisClient.del(cacheKeys);

        const responseData = {
            status: 200,
            message: "Cliente atualizado com sucesso.",
            fromCache: false,
            data: clientData,
        };

        successHandler(res, responseData);
    },
);

/**
 * @description Delete client
 * @route       DELETE /api/clients/:id
 * @access      Private
 */
export const deleteClient = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const clientExists = await ClientModel.getClientById(Number(req.params.id));

        if (!clientExists || clientExists.length === 0) {
            res.status(400);
            throw new Error("Cliente não encontrado!");
        }

        if (!req.user) {
            res.status(400);
            throw new Error("Usuário não encontrado!");
        }

        if (clientExists[0].idAdmin !== Number(req.user.id)) {
            res.status(400);
            throw new Error("Usuário não autorizado!");
        }

        await ClientModel.deleteClient(Number(req.params.id), req.user.id);

        const cacheKeys = await redisClient.keys(`client:user:${req.user.id}:*`);

        if (cacheKeys.length > 0) await redisClient.del(cacheKeys);

        const responseData = {
            status: 200,
            message: "Cliente deletado com sucesso",
            fromCache: false,
            data: {
                id: req.params.id,
            },
        };

        successHandler(res, responseData);
    },
);
