import { RowDataPacket } from "mysql2";

export interface IClientModel {
    id: number;
    name: string;
    sex: "M" | "F" | "Outro";
    phone: string;
    address: string;
    birth: string;
    idAdmin: number;
}

export interface IClienteModelResponse {
    clients: (IClientModel & RowDataPacket)[];
    total: string;
}
