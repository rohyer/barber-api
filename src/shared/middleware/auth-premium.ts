import asyncHandler from "express-async-handler";
import { Response as ExpressResponse } from "express";
import { AuthenticatedRequest } from "../types/express.type.js";
import UserModel from "../../modules/user/user.model.js";

export const protectPremium = asyncHandler(
  async (req: AuthenticatedRequest, res: ExpressResponse, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("User not found.");
    }

    const user = await UserModel.getUserById(req.user.id);

    if (user[0].status === 0) {
      res.status(401);
      throw new Error("User does not have access to the resource.");
    }

    next();
  },
);
