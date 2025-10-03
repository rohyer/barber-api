import { RowDataPacket } from "mysql2";

export interface IClientCustomerService {
    lastCustomerServiceDate: string | null;
}

export interface IClientModel {
    id: number;
    name: string;
    sex: "M" | "F" | "Outro";
    phone: string;
    address: string;
    birth: string;
    idAdmin: number;
}

export interface IClientModelResponse {
    clients: (IClientModel & IClientCustomerService & RowDataPacket)[];
    total: number;
}

export type GetClientsQuery = {
    page: number;
    query: string;
};
