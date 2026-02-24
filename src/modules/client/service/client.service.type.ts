import { CreateClientDTO, DeleteClientDTO, GetClientsDTO, UpdateClientDTO } from "../client.dto.js";

export type CreateClientService = CreateClientDTO & {
    idAdmin: number;
};

export type GetClientsService = GetClientsDTO & {
    idAdmin: number;
    cacheKey: string | undefined;
};

export type UpdateClientService = UpdateClientDTO & {
    id: number;
    idAdmin: number;
};

export type DeleteClientService = {
    id: DeleteClientDTO;
    idAdmin: number;
};