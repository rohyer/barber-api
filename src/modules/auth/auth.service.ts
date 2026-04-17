import { RegisterBarberShop } from "./auth.dto.js";
import { AuthRepository } from "./auth.repository.js";

export class AuthService {
    constructor(private authRepository: AuthRepository) {}

    createBarbershop = async (barbershopData: RegisterBarberShop) => {
        const isEmailAvailable = await this.authRepository.isEmailAvailable(barbershopData.email);

        if (!isEmailAvailable)
            throw new Error("E-mail não disponível");

        const barbershopEntity = await this.authRepository.insertBarbershop(barbershopData);

        if (!barbershopData)
            throw new Error("Erro ao criar usuário");
        
        return barbershopEntity;
    };
}