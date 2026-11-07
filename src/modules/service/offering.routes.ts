import express from "express";
const router = express.Router();
import { authenticate } from "../../shared/middleware/authenticate.js";
import { cacheResponse } from "../../shared/middleware/cache-response.js";
import { OfferingController } from "./offering.controller.js";
import { validateRequest } from "../../shared/middleware/validate-request.js";
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
    authenticate,
    cacheResponse("offering"),
    validateRequest(GetOfferingSchema, "query"),
    (req, res, next) => offeringController.getOfferings(req, res, next),
);

router.post(
    "/",
    authenticate,
    validateRequest(CreateOfferingSchema),
    (req, res, next) => offeringController.registerOffering(req, res, next),
);

router.put(
    "/:id",
    authenticate,
    validateRequest(UpdateOfferingSchema),
    (req, res, next) => offeringController.updateOffering(req, res, next),
);

router.delete(
    "/:id",
    authenticate,
    validateRequest(ParamsSchema, "params"),
    (req, res, next) => offeringController.deleteOffering(req, res, next),
);

export default router;
