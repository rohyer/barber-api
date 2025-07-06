import { ResultSetHeader, RowDataPacket } from "mysql2";
import getDatabaseConnection from "../../shared/config/db.js";
import redisClient from "../../shared/config/redis-client.js";
import { IService } from "./service.type.js";

const ServiceModel = {
    async getServiceByName(name: IService["name"]) {
        const db = getDatabaseConnection();

        const [result] = await db.execute<(IService & RowDataPacket)[]>(
            "SELECT name FROM service WHERE name = ? LIMIT 1",
            [name],
        );
        return result;
    },

    async getServiceById(id: IService["name"]) {
        const db = getDatabaseConnection();

        const [result] = await db.execute<(IService & RowDataPacket)[]>(
            "SELECT id, name, value, id_admin FROM service WHERE id = ? LIMIT 1",
            [id],
        );
        return result;
    },

    async getServices(idAdmin: IService["idAdmin"]) {
        const db = getDatabaseConnection();

        const [result] = await db.execute<(IService & RowDataPacket)[]>(
            "SELECT id, name, value FROM service WHERE id_admin = ?",
            [idAdmin],
        );
        return result;
    },

    async createService({ name, value, idAdmin }: Omit<IService, "id">) {
        const db = getDatabaseConnection();

        const [result] = await db.execute<ResultSetHeader>(
            "INSERT INTO service (name, value, id_admin) VALUES (?, ?, ?)",
            [name, value, idAdmin],
        );

        await redisClient.del(`services:user:${idAdmin}`);
        return result;
    },

    async updateService({ name, value, id, idAdmin }: IService) {
        const db = getDatabaseConnection();

        const [result] = await db.execute<ResultSetHeader>(
            "UPDATE service SET name = ?, value = ? WHERE id = ? LIMIT 1",
            [name, value, id],
        );

        await redisClient.del(`services:user:${idAdmin}`);
        return result;
    },

    async deleteService(id: IService["id"], idAdmin: IService["idAdmin"]) {
        const db = getDatabaseConnection();

        const [result] = await db.execute<ResultSetHeader>("DELETE FROM service WHERE id = ?", [
            id,
        ]);

        await redisClient.del(`services:user:${idAdmin}`);
        return result;
    },
};

export default ServiceModel;
