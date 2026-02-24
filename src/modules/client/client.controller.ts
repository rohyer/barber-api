import asyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Response as ExpressResponse, NextFunction } from "express";
import { successHandler } from "../../shared/utils/successHandler.js";
import { ParamsDictionary } from "express-serve-static-core";
import { CreateClientSchema, DeleteClientSchema, GetClientsDTO, GetClientsSchema, UpdateClientSchema } from "./client.dto.js";
import { ClientService } from "./service/client.service.js";

export class ClientController {
    constructor(private clientService: ClientService) {}

    createClient = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const schemaValidation = CreateClientSchema.safeParse(req.body);

        if (!schemaValidation.success) 
            throw new Error(schemaValidation.error.message);

        const idAdmin = req.user!.id;

        const result = await this.clientService.createClient({ ...schemaValidation.data, idAdmin });

        const responseData = {
            status: 201,
            message: "Cliente cadastrado com sucesso.",
            fromCache: false,
            data: { ...result },
        };

        successHandler(res, responseData);
    });

    getClients = asyncHandler(async (
        req: AuthenticatedRequest<ParamsDictionary, any, any, GetClientsDTO>,
        res: ExpressResponse,
        _next: NextFunction,
    ) => {
        const schemaValidation = GetClientsSchema.safeParse(req.query);

        if (!schemaValidation.success) 
            throw new Error(schemaValidation.error.message);

        const idAdmin = req.user!.id;

        const data = await this.clientService.getClients({
            ...schemaValidation.data,
            idAdmin,
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

    getClientsByName = asyncHandler(async (
        req: AuthenticatedRequest<ParamsDictionary, any, any, GetClientsDTO>,
        res: ExpressResponse,
        _next: NextFunction,
    ) => {
        const schemaValidation = GetClientsSchema.safeParse(req.query);

        if (!schemaValidation.success) 
            throw new Error(schemaValidation.error.message);

        const idAdmin = req.user!.id;

        const data = await this.clientService.getClientsByName({
            ...schemaValidation.data,
            idAdmin,
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

    updateClient = asyncHandler(async (
        req: AuthenticatedRequest,
        res: ExpressResponse,
        _next: NextFunction,
    ) => {
        const validateSchema = UpdateClientSchema.safeParse(req.body);

        if (!validateSchema.success) 
            throw new Error(validateSchema.error.message);

        const clientData = {
            ...validateSchema.data,
            id: Number(req.params.id),
            idAdmin: req.user!.id,
        };

        const data = await this.clientService.updateClient(clientData);

        const responseData = {
            status: 200,
            message: "Cliente editado com sucesso.",
            fromCache: false,
            data,
        };

        return successHandler(res, responseData);
    });

    deleteClient = asyncHandler(async (
        req: AuthenticatedRequest,
        res: ExpressResponse,
        _next: NextFunction,
    ) => {
        const validateSchema = DeleteClientSchema.safeParse(req.params.id);

        if (!validateSchema.success)
            throw new Error(validateSchema.error.message);

        const isDeletedClient = await this.clientService.deleteClient({
            id: validateSchema.data,
            idAdmin: req.user!.id,
        });

        if (!isDeletedClient)
            throw new Error("Erro ao deletar cliente");

        const responseData = {
            status: 200,
            message: "Cliente deletado com sucesso",
            fromCache: false,
            data: {
                id: req.params.id,
            },
        };

        return successHandler(res, responseData);
    });

}