import jwt from "jsonwebtoken";
import { Barbershop } from "./auth.type.js";
import { AUTH } from "./auth.constants.js";

export class JwtService {
    generateToken = (id: Barbershop["id"]) => {
        if (!process.env.JWT_SECRET) 
            throw new Error("Variável de ambiente não definida");

        return jwt.sign(
            { id },
            process.env.JWT_SECRET,
            { expiresIn: AUTH.EXPIRES_IN_7_DAYS },
        );
    };
    
}