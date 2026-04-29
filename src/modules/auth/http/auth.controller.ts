import asyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../../../shared/types/express.type.js";
import { Response as ExpressResponse } from "express";
import { AuthService } from "../auth.service.js";
import { successHandler } from "../../../shared/utils/successHandler.js";
import { LoginResponse } from "./auth.response.dto.js";
import { AuthEntity } from "../auth.entity.js";
import { AUTH } from "../auth.constants.js";

const toLoginResponse = (barbershopEntity: AuthEntity): LoginResponse => {
    return {
        id: barbershopEntity.data.id,
        name: barbershopEntity.data.name,
        email: barbershopEntity.data.email,
        city: barbershopEntity.data.city,
        state: barbershopEntity.data.state,
        phone: barbershopEntity.data.phone,
    };
};

export class AuthController {
    constructor(private authService: AuthService) {}

    registerUser = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const { data, token } = await this.authService.createBarbershop(req.body);

        const validateResponse = toLoginResponse(data);

        const response = {
            status: 201,
            message: "Barbearia cadastrada com sucesso",
            fromCache: false,
            data: validateResponse,
        };

        res.status(201).cookie(AUTH.COOKIE_NAME, token, {
            httpOnly: true,
            secure: true,
            sameSite: true,
            maxAge: AUTH.COOKIE_MAX_AGE,
        });

        return successHandler(res, response);
    });

    loginUser = asyncHandler(async(req: AuthenticatedRequest, res: ExpressResponse) => {
        const { data, token } = await this.authService.loginBarbershop(req.body);

        const validateResponse = toLoginResponse(data);

        const response = {
            status: 200,
            message: "Login feito com sucesso",
            fromCache: false,
            data: validateResponse,
        };

        res.status(200).cookie(AUTH.COOKIE_NAME, token, {
            httpOnly: true,
            secure: true,
            sameSite: true,
            maxAge: AUTH.COOKIE_MAX_AGE,
        });

        return successHandler(res, response);
    });

    authMe = asyncHandler(async(req: AuthenticatedRequest, res: ExpressResponse) => {
        const response = {
            status: 200,
            message: "Autenticação feita com sucesso",
            fromCache: false,
            data: req?.user,
        };

        return successHandler(res, response);
    });

}