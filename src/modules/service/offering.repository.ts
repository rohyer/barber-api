import { ResultSetHeader, RowDataPacket } from "mysql2";
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
            "SELECT id, name, value FROM service WHERE id_admin = ? AND (? = '' OR name LIKE CONCAT('%', ?, '%')) ORDER BY id DESC LIMIT 10 OFFSET ?",
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

    async isNameAvailable(name: OfferingEntityProps["name"], idAdmin: OfferingEntityProps["id"]): Promise<boolean> {
        const [offeringRows] = await this.db.execute<(OfferingEntityProps["name"] & RowDataPacket)[]>(
            "SELECT name FROM service WHERE name = ? AND id_admin = ? LIMIT 1",
            [name, idAdmin],
        );

        const isAvailable = offeringRows.length === 0;

        return isAvailable;
    };

    async findOfferingById(id: OfferingEntityProps["id"]): Promise<OfferingEntity | null> {
        const [offeringRow] = await this.db.execute<(OfferingEntity & RowDataPacket)[]>(
            "SELECT id, name, value, id_admin FROM service WHERE id = ? LIMIT 1",
            [id],
        );

        if (offeringRow.length === 0)
            return null;

        const offering = OfferingEntity.createFromDatabase({ ...offeringRow[0] });

        return offering;
    };

    async createOffering(offering: OfferingEntity): Promise<OfferingEntity | null> {
        const { name, value, idAdmin } = offering.data;

        const [result] = await this.db.execute<ResultSetHeader>(
            "INSERT INTO service (name, value, id_admin) VALUES (?, ?, ?)",
            [name, value, idAdmin],
        );

        if (!result.insertId)
            return null;

        const createdOffering = OfferingEntity
            .createFromDatabase({ ...offering.data, id: result.insertId });

        return createdOffering;
    };

    async updateOffering(offering: OfferingEntity): Promise<OfferingEntity | null> {
        const { id, name, value } = offering.data;

        const [result] = await this.db.execute<ResultSetHeader>(
            "UPDATE service SET name = ?, value = ? WHERE id = ? LIMIT 1",
            [name, value, id],
        );

        if (result.affectedRows === 0)
            return null;

        const updatedOffering = OfferingEntity.createFromDatabase({ ...offering.data });

        return updatedOffering;
    };

    async deleteOffering(id: OfferingEntityProps["id"]): Promise<boolean> {
        const [result] = await this.db.execute<ResultSetHeader>("DELETE FROM service WHERE id = ?", [id]);

        const isDeleted = result.affectedRows > 0;

        return isDeleted;
    };
};