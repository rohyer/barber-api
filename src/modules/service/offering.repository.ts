import { ResultSetHeader, RowDataPacket } from "mysql2";
import getDatabaseConnection from "../../shared/config/db.js";
import redisClient from "../../shared/config/redis-client.js";
import { Pool } from "mysql2/promise";
import { OfferingEntity, OfferingEntityProps } from "./offering.entity.js";

type FindAllOfferingParams = {
    idAdmin: number;
    offset: number;
    query: string;
};

type FindAllOfferingResponse = {
    offerings: OfferingEntity[];
    total: number;
};

export class OfferingRepository {
    constructor(private readonly db: Pool) {}

    async findAllOfferings(data: FindAllOfferingParams): Promise<FindAllOfferingResponse | null> {
        const { idAdmin, offset, query } = data;

        const [offeringRows] = await this.db.execute<(OfferingEntity & RowDataPacket)[]>(
            "SELECT id, name, value FROM service WHERE id_admin = ? AND (? = '' OR e.name LIKE CONCAT('%', ?, '%')) ORDER BY id DESC LIMIT OFFSET ?",
            [idAdmin, query, query, offset],
        );

        const offerings = offeringRows.map(offeringRow => OfferingEntity.createFromDatabase(offeringRow));

        const [totalRows] = await this.db.execute<RowDataPacket[]>(
            "SELECT COUNT(*) AS total from service WHERE id_admin = ? AND (? = '' OR name LIKE CONCAT('%', ?, '%'))",
            [idAdmin, query, query],
        );

        const total = totalRows[0].total as number;

        return {
            offerings,
            total,
        };
    };

    async getServiceByName(name: OfferingEntityProps["name"]) {
        const db = getDatabaseConnection();

        const [offeringRows] = await db.execute<(OfferingEntityProps["name"] & RowDataPacket)[]>(
            "SELECT name FROM service WHERE name = ? LIMIT 1",
            [name],
        );

        return offeringRows;
    };

    async getServiceById(id: OfferingEntityProps["id"]): Promise<OfferingEntity | null> {
        const db = getDatabaseConnection();

        const [offeringRow] = await db.execute<(OfferingEntity & RowDataPacket)[]>(
            "SELECT id, name, value, id_admin FROM service WHERE id = ? LIMIT 1",
            [id],
        );

        if (offeringRow.length === 0)
            return null;

        const offering = OfferingEntity.createFromDatabase({ ...offeringRow[0] });

        return offering;
    };

    async createService(offering: OfferingEntity) {
        const { name, value, idAdmin } = offering.data;

        const [result] = await this.db.execute<ResultSetHeader>(
            "INSERT INTO service (name, value, id_admin) VALUES (?, ?, ?)",
            [name, value, idAdmin],
        );

        const createdOffering = OfferingEntity
            .createFromDatabase({ ...offering.data, id: result.insertId });

        return createdOffering;
    };

    async updateService(offering: OfferingEntity) {
        const { name, value, id, idAdmin } = offering.data;

        const [result] = await this.db.execute<ResultSetHeader>(
            "UPDATE service SET name = ?, value = ? WHERE id = ? LIMIT 1",
            [name, value, id],
        );

        await redisClient.del(`services:user:${idAdmin}`);
        return result;
    };

    async deleteService(id: OfferingEntityProps["id"], idAdmin: OfferingEntityProps["idAdmin"]) {
        const [result] = await this.db.execute<ResultSetHeader>("DELETE FROM service WHERE id = ?", [id]);

        await redisClient.del(`services:user:${idAdmin}`);
        return result;
    };
};