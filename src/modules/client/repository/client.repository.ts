import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { ClientEntity, ClientEntityProps } from "../client.entity.js";
import { GetClientsParams, GetClientsResponse } from "./client.repository.type.js";

export class ClientRepository {
    constructor(private readonly db: Pool) {};

    async getClients({ idAdmin, offset, query }: GetClientsParams): Promise<GetClientsResponse | null> {
        const [clientRows] = await this.db.execute<(ClientEntityProps & RowDataPacket)[]>(
            "SELECT c.id, c.name, c.sex, c.phone, c.address, c.birth, c.created_at AS createdAt, c.id_admin as idAdmin, MAX(cs.date) AS lastCustomerServiceDate FROM client c LEFT JOIN customer_service cs ON c.id = cs.id_client WHERE c.id_admin = ? AND (? = '' OR c.name LIKE CONCAT('%', ?, '%')) GROUP BY c.id, c.name, c.sex, c.phone, c.address, c.birth ORDER BY c.id DESC LIMIT 10 OFFSET ?",
            [idAdmin, query, query, offset],
        );

        const clients = clientRows.map(clientRow => ClientEntity.createFromDatabase(clientRow));

        const [totalRows] = await this.db.execute<RowDataPacket[]>(
            "SELECT COUNT(*) AS total FROM client WHERE id_admin = ? AND (? = '' OR name LIKE CONCAT('%', ?, '%'))",
            [idAdmin, query, query],
        );

        const total = totalRows[0].total as number;

        return {
            clients,
            total,
        };
    }

    async getClientsByName({ idAdmin, offset, query }: GetClientsParams): Promise<{ clientRows: ClientEntityProps["name"][] } | null> {
        const [clientRows] = await this.db.execute<(ClientEntityProps["name"] & RowDataPacket)[]>(
            "SELECT name FROM client WHERE id_admin = ? AND (? = '' OR name LIKE CONCAT('%', ?, '%')) ORDER BY id DESC LIMIT 10 OFFSET ?",
            [idAdmin, query, query, offset],
        );

        return {
            clientRows,
        };
    }

    async getClientById(id: ClientEntityProps["id"]): Promise<ClientEntity | null> {
        const [clientRows] = await this.db.execute<(ClientEntityProps & RowDataPacket)[]>(
            "SELECT id, name, sex, phone, address, birth, id_admin AS idAdmin FROM client WHERE id = ? LIMIT 1",
            [id],
        );

        if (clientRows.length === 0) 
            return null;

        const client = ClientEntity.createFromDatabase(clientRows[0]);

        return client;
    }

    async createClient(client: ClientEntity): Promise<ClientEntity | null> {
        const { name, sex, phone, address, birth, idAdmin } = client.data;

        const [result] = await this.db.execute<ResultSetHeader>(
            "INSERT INTO client (name, sex, phone, address, birth, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
            [name, sex, phone, address, birth, idAdmin],
        );

        const createdClient = ClientEntity.createFromDatabase({ ...client.data, id: result.insertId });

        return createdClient;
    }

    async updateClient(client: ClientEntity): Promise<ClientEntity | null> {
        const { id, name, sex, phone, address, birth } = client.data;

        const [result] = await this.db.execute<ResultSetHeader>(
            "UPDATE client SET name = ?, sex = ?, phone = ?, address = ?, birth = ? WHERE id = ?",
            [name, sex, phone, address, birth, id],
        );

        if (result.affectedRows === 0)
            return null;        

        const updatedClient = ClientEntity.createFromDatabase({ ...client.data });

        return updatedClient;
    }

    async deleteClient(id: ClientEntityProps["id"]): Promise<boolean> {
        const [result] = await this.db.execute<ResultSetHeader>("DELETE FROM client WHERE id = ?", [id]);

        const isDeleted = result.affectedRows > 0;

        return isDeleted;
    }
}
