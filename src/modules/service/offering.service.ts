import redisClient from "../../shared/config/redis-client.js";
import { GetOfferingDTO } from "./offering.dto.js";
import { OfferingRepository } from "./offering.repository.js";

type GetOfferingService = GetOfferingDTO & {
    idAdmin: number;
    cacheKey: string | undefined;
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
}