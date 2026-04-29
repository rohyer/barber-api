import jwt from "jsonwebtoken";
import { Barbershop } from "./auth.type.js";

export class JwtService {
    generateToken = (barbershop: Barbershop & { id: number }) => {
        if (!process.env.JWT_SECRET) 
            throw new Error("Variável de ambiente não definida");

        return jwt.sign(
            {
                id: barbershop.id,
                name: barbershop.name,
                email: barbershop.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );
    };
    
}