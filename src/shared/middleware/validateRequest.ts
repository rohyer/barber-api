import z, { ZodType } from "zod";
import { AuthenticatedRequest } from "../types/express.type.js";
import { Response as ExpressResponse, NextFunction } from "express";
import asyncHandler from "express-async-handler";

export const validateRequest = (schema: ZodType, target: "body" | "query" | "params" = "body") => 
    asyncHandler (async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
        {
            const validatedSchema = schema.safeParse(req[target]);

            if (!validatedSchema.success) {
                const errorMessage = validatedSchema.error.issues
                    .map(issue => issue.message)
                    .join(", ");

                throw new Error(errorMessage);
            }

            req[target] = validatedSchema.data;

            return next();
        }
    });