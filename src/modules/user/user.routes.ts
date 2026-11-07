import express from "express";
const router = express.Router();
import { authenticate } from "../../shared/middleware/authenticate.js";
import {
    updateUserData,
    updateUserPassword,
    updateUserEmail,
} from "./user.controller.js";

router.put("/:id", authenticate, updateUserData);

router.put("/password/:id", authenticate, updateUserPassword);

router.put("/email/:id", authenticate, updateUserEmail);

export default router;
