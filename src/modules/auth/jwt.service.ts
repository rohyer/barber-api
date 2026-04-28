import jwt from "jsonwebtoken";

export class JwtService {
    generateToken = (barbershopId: number) => {
        if (!process.env.JWT_SECRET) 
            throw new Error("Variável de ambiente não definida");
    
        return jwt.sign(
            { id: barbershopId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );
    };
    
}