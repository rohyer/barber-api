import getDatabaseConnection from "../../shared/config/db.js";
import redisClient from "../../shared/config/redis-client.js";
import { IClientModel } from "./client.types.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const ClientModel = {
    async getClients(
        idAdmin: IClientModel["idAdmin"],
    ): Promise<(IClientModel & RowDataPacket)[] | null> {
        const db = getDatabaseConnection();

        const [result] = await db.execute<(IClientModel & RowDataPacket)[]>(
            "SELECT id, name, sex, phone, address, birth FROM client WHERE id_admin = ?",
            [idAdmin],
        );
        return result;
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
    }: Omit<IClientModel, "id">): Promise<ResultSetHeader> {
        const db = getDatabaseConnection();

        const [result] = await db.execute<ResultSetHeader>(
            "INSERT INTO client (name, sex, phone, address, birth, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
            [name, sex, phone, address, birth, idAdmin],
        );

        await redisClient.del(`clients:user:${idAdmin}`);
        return result;
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
