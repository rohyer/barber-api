import express from "express";
const router = express.Router();
import {
    getCustomerServices,
    setCustomerService,
    updateCustomerService,
    deleteCustomerService,
} from "./customer-service.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { cacheResponse } from "../../shared/middleware/cache-response.js";

router.get("/", authenticate, cacheResponse("customer-service"), getCustomerServices);

router.post("/", authenticate, setCustomerService);

router.put("/:id", authenticate, updateCustomerService);

router.delete("/:id", authenticate, deleteCustomerService);

export default router;
