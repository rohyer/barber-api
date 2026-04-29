import { AuthRepository } from "./auth.repository.js";
import { JwtService } from "./jwt.service.js";
import { Barbershop, LoginBarbershop } from "./auth.type.js";
import { HashService } from "./hash.service.js";

export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private jwtService: JwtService,
        private hashService: HashService,
    ) {}

    createBarbershop = async (barbershopData: Barbershop) => {
        const isEmailRegistered = await this.authRepository.isEmailRegistered(barbershopData.email);

        if (isEmailRegistered)
            throw new Error("E-mail não disponível");

        const passwordHashed = await this.hashService.hash(barbershopData.password);

        const dateNow = new Date();
        const premiumExpiresAt = new Date(dateNow.getTime() + 31 * 24 * 60 * 60 * 1000);

        const barbershopEntity = await this.authRepository.insertBarbershop({
            ...barbershopData,
            password: passwordHashed,
            premiumExpiresAt,
        });

        if (!barbershopEntity || !barbershopEntity.data.id)
            throw new Error("Erro ao criar usuário");
        
        const token = this.jwtService.generateToken(barbershopEntity.data);

        return {
            data: barbershopEntity,
            token,
        };
    };

    loginBarbershop = async(barbershopData: LoginBarbershop) => {
        const isEmailRegistered = await this.authRepository.isEmailRegistered(barbershopData.email);

        if (!isEmailRegistered)
            throw new Error("E-mail não encontrado");
    
        const barbershopEntity = await this.authRepository.findUserByEmail(barbershopData.email);

        if (!barbershopEntity)
            throw new Error("Usuário não encontrado");

        const isCorrectPassword = await this.hashService.compare(barbershopData.password, barbershopEntity.data.password);

        if (!isCorrectPassword)
            throw new Error("Senha inválida");

        const token = this.jwtService.generateToken(barbershopEntity.data);

        return {
            data: barbershopEntity,
            token,
        };
    };
}