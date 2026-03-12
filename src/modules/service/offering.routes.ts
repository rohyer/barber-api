import express from "express";
const router = express.Router();
import { protect } from "../../shared/middleware/auth.js";
import { cacheMiddleware } from "../../shared/middleware/cache.js";
import { OfferingController } from "./offering.controller.js";
import { validateRequest } from "../../shared/middleware/validateRequest.js";
import { CreateOfferingSchema, GetOfferingSchema, ParamsSchema, UpdateOfferingSchema } from "./offering.dto.js";
import { OfferingRepository } from "./offering.repository.js";
import { OfferingService } from "./offering.service.js";
import getDatabaseConnection from "../../shared/config/db.js";

const db = getDatabaseConnection();

const offeringRepository = new OfferingRepository(db);
const offeringService = new OfferingService(offeringRepository);
const offeringController = new OfferingController(offeringService);

router.get(
    "/",
    protect,
    cacheMiddleware("service"),
    validateRequest(GetOfferingSchema, "query"),
    (req, res, next) => offeringController.getOfferings(req, res, next),
);

router.post(
    "/",
    protect,
    validateRequest(CreateOfferingSchema),
    (req, res, next) => offeringController.registerOffering(req, res, next),
);

router.put(
    "/:id",
    protect,
    validateRequest(UpdateOfferingSchema),
    (req, res, next) => offeringController.updateOffering(req, res, next),
);

router.delete(
    "/:id",
    protect,
    validateRequest(ParamsSchema, "params"),
    (req, res, next) => offeringController.deleteOffering(req, res, next),
);

export default router;
