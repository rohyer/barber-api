import express from "express";
const router = express.Router();
import { protect } from "../../shared/middleware/auth.js";
import { cacheMiddleware } from "../../shared/middleware/cache.js";
import { setService, updateService, deleteService, OfferingController } from "./offering.controller.js";
import { validateRequest } from "../../shared/middleware/validateRequest.js";
import { GetOfferingSchema } from "./offering.dto.js";
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
    setService,
);

router.put(
    "/:id",
    protect,
    updateService,
);

router.delete(
    "/:id",
    protect,
    deleteService,
);

export default router;
