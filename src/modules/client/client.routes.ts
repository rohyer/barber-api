import express from "express";
const router = express.Router();
import { protect } from "../../shared/middleware/auth.js";
import { cacheMiddleware } from "../../shared/middleware/cache.js";
import { ClientService } from "./service/client.service.js";
import { ClientController } from "./client.controller.js";
import { ClientRepository } from "./repository/client.repository.js";
import getDatabaseConnection from "../../shared/config/db.js";

const db = getDatabaseConnection();

const clientRepository = new ClientRepository(db);
const clientService = new ClientService(clientRepository);
const clientController = new ClientController(clientService);

router.get(
    "/",
    protect,
    cacheMiddleware("client"),
    (req, res, next) => clientController.getClients(req, res, next),
);

router.get(
    "/options",
    protect,
    cacheMiddleware("client"),
    (req, res, next) => clientController.getClientsByName(req, res, next),
);

router.post(
    "/",
    protect,
    (req, res, next) => clientController.createClient(req, res, next),
);

router.put(
    "/:id",
    protect,
    (req, res, next) => clientController.updateClient(req, res, next),
);

router.delete(
    "/:id",
    protect,
    (req, res, next) => clientController.deleteClient(req, res, next),
);

export default router;
