import express from "express";
const router = express.Router();
import {
    getClients,
    registerClient,
    updateClient,
    deleteClient,
    getClientsByName,
} from "./client.controller.js";
import { protect } from "../../shared/middleware/auth.js";
import { cacheMiddleware } from "../../shared/middleware/cache.js";

router.get("/", protect, cacheMiddleware, getClients);

router.get("/options", protect, cacheMiddleware, getClientsByName);

router.post("/", protect, registerClient);

router.put("/:id", protect, updateClient);

router.delete("/:id", protect, deleteClient);

export default router;
