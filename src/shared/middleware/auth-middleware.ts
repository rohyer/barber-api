import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import UserModel from "../../modules/user/user.model.js";
import { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest, IUserPayload } from "../types/express.type.js";

export const protect = asyncHandler(
  async (req: AuthenticatedRequest, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        if (!process.env.JWT_SECRET)
          throw new Error("JWT_SECRET não definido!");

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        const result = await UserModel.getUserById(decoded.id);

        req.user = result[0] as IUserPayload;

        next();
      } catch (error) {
        throw new Error("Não autorizado", { cause: error });
      }
    } else {
      throw new Error("Sem autorização");
    }
  },
);
