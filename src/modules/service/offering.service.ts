import redisClient from "../../shared/config/redis-client.js";
import { CreateOfferingDTO, GetOfferingDTO, UpdateOfferingDTO } from "./offering.dto.js";
import { OfferingEntity } from "./offering.entity.js";
import { OfferingRepository } from "./offering.repository.js";

type GetOfferingService = GetOfferingDTO & {
    idAdmin: number;
    cacheKey: string | undefined;
};

type RegisterOfferingService = CreateOfferingDTO & {
    idAdmin: number;
    cacheKey: string | undefined;
};

type UpdateOfferingService = UpdateOfferingDTO & {
    idAdmin: number;
    id: number;
};

export class OfferingService {
    constructor(private offeringRepository: OfferingRepository) {}

    getOfferings = async (data: GetOfferingService) => {
        const offset = (data.page - 1) * 10;

        const queryResult = await this.offeringRepository.findAllOfferings({
            idAdmin: data.idAdmin,
            query: data.query,
            offset,
        });

        if (!queryResult)
            return null;

        const offerings = queryResult.offerings.map(offering => offering.data);

        const result = {
            offerings,
            total: queryResult.total,
        };

        if (data.cacheKey)
            redisClient.set(data.cacheKey, JSON.stringify(result), { EX: 300 });

        return result;
    };

    registerOffering = async(data: RegisterOfferingService) => {
        const offeringExists = await this.offeringRepository.getServiceByName(data.name);

        if (offeringExists.length > 0)
            throw new Error("Serviço já existente");

        const offering = new OfferingEntity({ ...data });

        const queryResult = await this.offeringRepository.createService(offering);

        if (!queryResult || !queryResult.data.id)
            throw new Error("Erro ao salvar serviço");

        const cacheKeys = await redisClient.keys(`offering:user:${data.idAdmin}:*`);

        if (cacheKeys.length > 0)
            await redisClient.del(cacheKeys);

        return queryResult;
    };

    updateOffering = async(data: UpdateOfferingService) => {
        const offering = await this.offeringRepository.getServiceById(data.id);

        if (!offering || !offering.data.id)
            throw new Error("Serviço não encontrado");

        if (data.idAdmin !== offering.data.idAdmin)
            throw new Error("Usuário não autorizado");

        offering.update({
            name: data.name,
            value: data.value,
        });

        const updatedOffering = await this.offeringRepository.updateService(offering);

        if (!updatedOffering)
            return null;

        const cacheKeys = await redisClient.keys(`offering:user:${data.idAdmin}:*`);

        if (cacheKeys.length > 0) 
            await redisClient.del(cacheKeys);

        return {
            data: updatedOffering,
        };
    };
}