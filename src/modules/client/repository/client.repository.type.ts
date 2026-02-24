import { ClientEntity } from "../client.entity.js";

export type GetClientsParams = {
    idAdmin: number;
    offset: number;
    query: string;
};

export type GetClientsResponse = {
    clients: ClientEntity[];
    total: number;
};