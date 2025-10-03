import getDatabaseConnection from "../../shared/config/db.js";
import redisClient from "../../shared/config/redis-client.js";
import { IClientModelResponse, IClientModel, IClientCustomerService } from "./client.types.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const ClientModel = {
    async getClients(
        idAdmin: IClientModel["idAdmin"],
        offset: number,
        query: string,
    ): Promise<IClientModelResponse | null> {
        const db = getDatabaseConnection();

        const [result] = await db.execute<
            (IClientModel & IClientCustomerService & RowDataPacket)[]
        >(
            "SELECT c.id, c.name, c.sex, c.phone, c.address, c.birth, c.created_at AS createdAt, MAX(cs.date) AS lastCustomerServiceDate FROM client c LEFT JOIN customer_service cs ON c.id = cs.id_client WHERE c.id_admin = ? AND (? = '' OR c.name LIKE CONCAT('%', ?, '%')) GROUP BY c.id, c.name, c.sex, c.phone, c.address, c.birth ORDER BY c.id DESC LIMIT 10 OFFSET ?",
            [idAdmin, query, query, offset],
        );

        const [rows] = await db.execute<RowDataPacket[]>(
            "SELECT COUNT(*) AS total FROM client WHERE id_admin = ? AND (? = '' OR name LIKE CONCAT('%', ?, '%'))",
            [idAdmin, query, query],
        );

        const total = rows[0].total as number;

        console.log(result);

        return {
            clients: result,
            total,
        };
    },

    async getClientsByName(
        idAdmin: IClientModel["idAdmin"],
        offset: number,
        query: string,
    ): Promise<{ clients: IClientModel["name"][] } | null> {
        const db = getDatabaseConnection();

        const [result] = await db.execute<(IClientModel["name"] & RowDataPacket)[]>(
            "SELECT name FROM client WHERE id_admin = ? AND (? = '' OR name LIKE CONCAT('%', ?, '%')) ORDER BY id DESC LIMIT 10 OFFSET ?",
            [idAdmin, query, query, offset],
        );

        return {
            clients: result,
        };
    },

    async getClientById(id: IClientModel["id"]): Promise<(IClientModel & RowDataPacket)[] | null> {
        const db = getDatabaseConnection();

        const [result] = await db.execute<(IClientModel & RowDataPacket)[]>(
            "SELECT id, name, sex, phone, address, birth, id_admin AS idAdmin FROM client WHERE id = ? LIMIT 1",
            [id],
        );
        return result;
    },

    async createClient({
        name,
        sex,
        phone,
        address,
        birth,
        idAdmin,
    }: Omit<IClientModel, "id">): Promise<Omit<IClientModel, "idAdmin">> {
        const db = getDatabaseConnection();

        const [result] = await db.execute<ResultSetHeader>(
            "INSERT INTO client (name, sex, phone, address, birth, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
            [name, sex, phone, address, birth, idAdmin],
        );

        const data = { id: result.insertId, name, sex, phone, address, birth };

        await redisClient.del(`clients:user:${idAdmin}`);

        return data;
    },

    async updateClient({ id, name, sex, phone, address, birth, idAdmin }: IClientModel) {
        const db = getDatabaseConnection();

        const [result] = await db.execute<ResultSetHeader>(
            "UPDATE client SET name = ?, sex = ?, phone = ?, address = ?, birth = ? WHERE id = ?",
            [name, sex, phone, address, birth, id],
        );

        await redisClient.del(`clients:user:${idAdmin}`);
        return result;
    },

    async deleteClient(
        id: IClientModel["id"],
        idAdmin: IClientModel["idAdmin"],
    ): Promise<ResultSetHeader> {
        const db = getDatabaseConnection();

        const [result] = await db.execute<ResultSetHeader>("DELETE FROM client WHERE id = ?", [id]);

        await redisClient.del(`clients:user:${idAdmin}`);
        return result;
    },
};

export default ClientModel;
