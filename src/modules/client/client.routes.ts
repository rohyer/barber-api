import express from "express";
const router = express.Router();
import { authenticate } from "../../shared/middleware/authenticate.js";
import { cacheResponse } from "../../shared/middleware/cache-response.js";
import { ClientService } from "./client.service.js";
import { ClientController } from "./client.controller.js";
import { ClientRepository } from "./client.repository.js";
import getDatabaseConnection from "../../shared/config/db.js";
import { validateRequest } from "../../shared/middleware/validate-request.js";
import { CreateClientSchema, GetClientsSchema, ParamsSchema, UpdateClientSchema } from "./client.dto.js";

const db = getDatabaseConnection();

const clientRepository = new ClientRepository(db);
const clientService = new ClientService(clientRepository);
const clientController = new ClientController(clientService);

router.get(
    "/",
    authenticate,
    validateRequest(GetClientsSchema, "query"),
    cacheResponse("client"),
    (req, res, next) => clientController.getClients(req, res, next),
);

router.get(
    "/options",
    authenticate,
    validateRequest(GetClientsSchema, "query"),
    cacheResponse("client"),
    (req, res, next) => clientController.getClientsByName(req, res, next),
);

router.post(
    "/",
    authenticate,
    validateRequest(CreateClientSchema),
    (req, res, next) => clientController.createClient(req, res, next),
);

router.put(
    "/:id",
    authenticate,
    validateRequest(UpdateClientSchema),
    validateRequest(ParamsSchema, "params"),
    (req, res, next) => clientController.updateClient(req, res, next),
);

router.delete(
    "/:id",
    authenticate,
    validateRequest(ParamsSchema, "params"),
    (req, res, next) => clientController.deleteClient(req, res, next),
);

export default router;
