import redisClient from "../../../shared/config/redis-client.js";
import { ClientEntity } from "../client.entity.js";
import { ClientRepository } from "../repository/client.repository.js";
import { CreateClientService, DeleteClientService, GetClientsService, UpdateClientService } from "./client.service.type.js";

export class ClientService {
    constructor(private clientRepository: ClientRepository) {}

    createClient = async (data: CreateClientService) => {
        const clientEntity = new ClientEntity({ ...data });

        const queryResult = await this.clientRepository.createClient(clientEntity);

        if (!queryResult || !queryResult.data.id)
            throw new Error("Erro ao persistir o cliente");

        const cacheKeys = await redisClient.keys(`client:user:${data.idAdmin}:*`);

        if (cacheKeys.length > 0)
            await redisClient.del(cacheKeys);

        return queryResult;
    };

    getClients = async (data: GetClientsService) => {
        const offset = (data.page - 1) * 10;

        const queryResult = await this.clientRepository.getClients({
            idAdmin: data.idAdmin,
            query: data.query,
            offset,
        });

        if (!queryResult) 
            return null;

        const clients = queryResult.clients.map(client => client.data);

        const result = {
            clients,
            total: queryResult.total,
        };

        if (data.cacheKey) 
            await redisClient.set(data.cacheKey, JSON.stringify(result), { EX: 300 });

        return result;
    };

    getClientsByName = async (data: GetClientsService) => {
        const offset = (data.page - 1) * 10;

        const queryResult = await this.clientRepository.getClientsByName({
            idAdmin: data.idAdmin,
            query: data.query,
            offset,
        });

        if (!queryResult) 
            return null;

        if (data.cacheKey) 
            await redisClient.set(data.cacheKey, JSON.stringify(queryResult), { EX: 300 });

        return { data: queryResult };
    };
    
    updateClient = async (data: UpdateClientService) => {
        const client = await this.clientRepository.getClientById(data.id);        

        if (!client || !client.data.id) 
            throw new Error("Cliente não encontrado");

        if (data.idAdmin !== client.data.idAdmin) 
            throw new Error("Usuário não autorizado");

        client.update({
            name: data.name,
            sex: data.sex,
            phone: data.phone,
            address: data.address,
            birth: data.birth,
        });

        const updatedClient = await this.clientRepository
            .updateClient(client);

        if (!updatedClient)
            return null;

        const cacheKeys = await redisClient.keys(`client:user:${data.idAdmin}:*`);

        if (cacheKeys.length > 0) 
            await redisClient.del(cacheKeys);

        return { data: updatedClient };
    };

    deleteClient = async (data: DeleteClientService) => {
        const client = await this.clientRepository.getClientById(Number(data.id));

        if (!client || !client.data.id)
            throw new Error("Cliente não encontrado!");

        if (data.idAdmin !== client.data.idAdmin)
            throw new Error("Usuário não autorizado!");

        const isDeletedClient = await this.clientRepository.deleteClient(client.data.id);

        const cacheKeys = await redisClient.keys(`client:user:${data.idAdmin}:*`);

        if (cacheKeys.length > 0) 
            await redisClient.del(cacheKeys);

        return isDeletedClient;
    };
}
