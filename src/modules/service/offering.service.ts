import redisClient from "../../shared/config/redis-client.js";
import { CreateOfferingDTO, DeleteOfferingDTO, GetOfferingDTO, UpdateOfferingDTO } from "./offering.dto.js";
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

type DeleteOfferingService = DeleteOfferingDTO & {
    idAdmin: number;
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
        };

        if (data.cacheKey)
            redisClient.set(data.cacheKey, JSON.stringify(result), { EX: 300 });

        return result;
    };

    registerOffering = async(data: RegisterOfferingService) => {
        const isAvailable = await this.offeringRepository.isNameAvailable(data.name, data.idAdmin);

        if (!isAvailable)
            throw new Error("Serviço já existente");

        const offering = new OfferingEntity({ ...data });

        const queryResult = await this.offeringRepository.createOffering(offering);

        if (!queryResult || !queryResult.data.id)
            throw new Error("Erro ao salvar serviço");

        const cacheKeys = await redisClient.keys(`offering:user:${data.idAdmin}:*`);

        if (cacheKeys.length > 0)
            await redisClient.del(cacheKeys);

        return queryResult;
    };

    updateOffering = async(data: UpdateOfferingService) => {
        const offering = await this.offeringRepository.findOfferingById(data.id);

        if (!offering || !offering.data.id)
            throw new Error("Serviço não encontrado");

        if (data.idAdmin !== offering.data.idAdmin)
            throw new Error("Usuário não autorizado");

        offering.update({
            name: data.name,
            value: data.value,
            duration: data.duration,
        });

        const updatedOffering = await this.offeringRepository.updateOffering(offering);

        if (!updatedOffering)
            return null;

        const cacheKeys = await redisClient.keys(`offering:user:${data.idAdmin}:*`);

        if (cacheKeys.length > 0) 
            await redisClient.del(cacheKeys);

        return updatedOffering;
    };

    deleteOffering = async (data: DeleteOfferingService) => {
        const offering = await this.offeringRepository.findOfferingById(Number(data.id));

        if (!offering || !offering.data.id)
            throw new Error("Serviço não encontrado");

        if (data.idAdmin !== offering.data.idAdmin)
            throw new Error("Usuário não autorizado");

        const isDeleted = await this.offeringRepository.deleteOffering(offering.data.id);

        const cacheKeys = await redisClient.keys(`offering:user:${data.idAdmin}:*`);

        if (cacheKeys.length > 0) 
            await redisClient.del(cacheKeys);

        return isDeleted;
    };
}