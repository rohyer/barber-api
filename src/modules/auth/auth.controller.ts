import asyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Response as ExpressResponse } from "express";
import { AuthService } from "./auth.service.js";
import { successHandler } from "../../shared/utils/successHandler.js";

export class AuthController {
    constructor(private authService: AuthService) {}

    registerUser = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const data = await this.authService.createBarbershop(req.body);

        const response = {
            status: 201,
            message: "Barbearia criada com sucesso",
            fromCache: false,
            data,
        };

        return successHandler(res, response);
    });

}