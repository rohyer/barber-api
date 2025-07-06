import asyncHandler from "express-async-handler";
import ClientModel from "./client.model.js";
import redisClient from "../../shared/config/redis-client.js";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Response as ExpressResponse } from "express";

/**
 * @description Get all clients
 * @route       GET /api/clients
 * @access      Private
 */
export const getClients = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
    if (!req.user) {
        res.status(401);
        throw new Error("Usuário não autenticado!");
    }

    const clients = await ClientModel.getClients(req.user.id);

    if (req.cacheKey) await redisClient.set(req.cacheKey, JSON.stringify(clients), { EX: 300 });

    res.status(200).json(clients);
});

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
            res.status(400);
            throw new Error("Por favor, preencha os campos!");
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

        res.status(201);
        res.json({
            success: true,
            message: "Cliente cadastrado com sucesso!",
            data: {
                userId: result.insertId,
            },
        });
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
            id: req.user.id,
            name,
            sex,
            phone,
            address,
            birth,
            idAdmin: Number(req.params.id),
        };

        const result = await ClientModel.updateClient(clientData);

        res.status(200);
        res.json({
            success: true,
            message: "Cliente atualizado com sucesso!",
            data: {
                affectedRows: result.affectedRows,
            },
        });
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

        const deletedClient = await ClientModel.deleteClient(Number(req.params.id), req.user.id);

        res.status(200);
        res.json({
            success: true,
            message: "Cliente deletado com sucesso",
            data: {
                id: req.params.id,
                affectedRows: deletedClient.affectedRows,
            },
        });
    },
);
