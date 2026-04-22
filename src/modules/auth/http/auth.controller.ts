import asyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../../../shared/types/express.type.js";
import { Response as ExpressResponse } from "express";
import { AuthService } from "../auth.service.js";
import { successHandler } from "../../../shared/utils/successHandler.js";
import { LoginResponse } from "./auth.response.dto.js";
import { AuthEntity } from "../auth.entity.js";

const toLoginResponse = (barbershopEntity: AuthEntity, token: string): LoginResponse => {
    return {
        token,
        data: {
            id: barbershopEntity.data.id,
            name: barbershopEntity.data.name,
            email: barbershopEntity.data.email,
            city: barbershopEntity.data.city,
            state: barbershopEntity.data.state,
            phone: barbershopEntity.data.phone,
        },
    };
};

export class AuthController {
    constructor(private authService: AuthService) {}

    registerUser = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const { data, token } = await this.authService.createBarbershop(req.body);

        const validateResponse = toLoginResponse(data, token);

        const response = {
            status: 201,
            message: "Barbearia cadastrada com sucesso",
            fromCache: false,
            data: validateResponse,
        };

        return successHandler(res, response);
    });

    loginUser = asyncHandler(async(req: AuthenticatedRequest, res: ExpressResponse) => {
        const data = await this.authService.loginBarbershop(req.body);

        const response = {
            status: 200,
            message: "Login feito com sucesso",
            fromCache: false,
            data,
        };

        return successHandler(res, response);
    });

}