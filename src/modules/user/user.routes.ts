import express from "express";
const router = express.Router();
import { protect } from "../../shared/middleware/auth.js";
import {
    registerUser,
    loginUser,
    updateUserData,
    updateUserPassword,
    updateUserEmail,
} from "./user.controller.js";

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/:id", protect, updateUserData);

router.put("/password/:id", protect, updateUserPassword);

router.put("/email/:id", protect, updateUserEmail);

export default router;
