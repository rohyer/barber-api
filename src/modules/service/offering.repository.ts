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
};

export class OfferingRepository {
    constructor(private readonly db: Pool) {}

    async findAllOfferings(data: FindAllOfferingParams): Promise<FindAllOfferingResponse | null> {
        const { idAdmin } = data;

        const [offeringRows] = await this.db.execute<(OfferingEntity & RowDataPacket)[]>(
            "SELECT o.id, o.name, o.value, o.duration, GROUP_CONCAT(e.name SEPARATOR ', ') AS employeeNames, GROUP_CONCAT(e.id SEPARATOR ', ') AS employeeIds FROM offering o LEFT JOIN employee_offering eo ON o.id = eo.id_offering LEFT JOIN employee e ON eo.id_employee = e.id WHERE o.id_admin = ? GROUP BY o.id ORDER BY o.id DESC",
            [idAdmin],
        );

        const offerings = offeringRows.map(offeringRow => OfferingEntity.createFromDatabase(offeringRow));

        return { offerings };
    };

    async isNameAvailable(name: OfferingEntityProps["name"], idAdmin: OfferingEntityProps["id"]): Promise<boolean> {
        const [offeringRows] = await this.db.execute<(OfferingEntityProps["name"] & RowDataPacket)[]>(
            "SELECT name FROM offering WHERE name = ? AND id_admin = ? LIMIT 1",
            [name, idAdmin],
        );

        const isAvailable = offeringRows.length === 0;

        return isAvailable;
    };

    async findOfferingById(id: OfferingEntityProps["id"]): Promise<OfferingEntity | null> {
        const [offeringRow] = await this.db.execute<(OfferingEntity & RowDataPacket)[]>(
            "SELECT id, name, value, duration, id_admin as idAdmin FROM offering WHERE id = ? LIMIT 1",
            [id],
        );

        if (offeringRow.length === 0)
            return null;

        const offering = OfferingEntity.createFromDatabase({ ...offeringRow[0] });

        return offering;
    };

    async createOffering(offering: OfferingEntity): Promise<OfferingEntity | null> {
        const { name, value, duration, idAdmin } = offering.data;

        const [result] = await this.db.execute<ResultSetHeader>(
            "INSERT INTO offering (name, value, duration, id_admin) VALUES (?, ?, ?, ?)",
            [name, value, duration, idAdmin],
        );

        if (!result.insertId)
            return null;

        const createdOffering = OfferingEntity
            .createFromDatabase({ ...offering.data, id: result.insertId });

        return createdOffering;
    };

    async updateOffering(offering: OfferingEntity): Promise<OfferingEntity | null> {
        const { id, name, duration, value } = offering.data;

        const [result] = await this.db.execute<ResultSetHeader>(
            "UPDATE offering SET name = ?, value = ?, duration = ? WHERE id = ? LIMIT 1",
            [name, value, duration, id],
        );

        if (result.affectedRows === 0)
            return null;

        const updatedOffering = OfferingEntity.createFromDatabase({ ...offering.data });

        return updatedOffering;
    };

    async deleteOffering(id: OfferingEntityProps["id"]): Promise<boolean> {
        const [result] = await this.db.execute<ResultSetHeader>("DELETE FROM offering WHERE id = ?", [id]);

        const isDeleted = result.affectedRows > 0;

        return isDeleted;
    };
};