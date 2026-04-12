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

type OfferingRows = Omit<OfferingEntityProps, "employees"> & RowDataPacket & {
    employeeId: number;
    employeeName: string;
};

export class OfferingRepository {
    constructor(private readonly db: Pool) {}

    async findAllOfferings(data: FindAllOfferingParams): Promise<FindAllOfferingResponse | null> {
        const { idAdmin } = data;

        const [offeringRows] = await this.db.execute<(OfferingRows)[]>(
            "SELECT o.id, o.name, o.value, o.duration, o.id_admin as idAdmin, e.id AS employeeId, e.name AS employeeName FROM offering o LEFT JOIN employee_offering eo ON o.id = eo.id_offering LEFT JOIN employee e ON eo.id_employee = e.id WHERE o.id_admin = ? ORDER BY o.id DESC",
            [idAdmin],
        );

        // treatment of employees to insert them as an object correctly
        const reducedOfferings = offeringRows.reduce<OfferingEntityProps[]>((accumulator, currentValue) => {
            let offering = accumulator.find(offering => offering.id === currentValue.id);

            if (!offering) {
                offering = {
                    id: currentValue.id,
                    name: currentValue.name,
                    value: currentValue.value,
                    duration: currentValue.duration,
                    idAdmin: currentValue.idAdmin,
                    employees: [],
                };
                accumulator.push(offering);
            }

            if (currentValue.employeeId && offering.employees) {
                offering.employees.push({
                    id: currentValue.employeeId,
                    name: currentValue.employeeName,
                });
            }

            return accumulator;
        }, []);
        
        const offerings = reducedOfferings.map(reducedOffering => OfferingEntity.createFromDatabase(reducedOffering));

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
        const { name, value, duration, employeeIds, idAdmin } = offering.data;
        
        const [offeringResult] = await this.db.execute<ResultSetHeader>(
            "INSERT INTO offering (name, value, duration, id_admin) VALUES (?, ?, ?, ?)",
            [name, value, duration, idAdmin],
        );
        
        if (!offeringResult.insertId)
            return null;
        
        const valuesToInsert = employeeIds?.map(employeeId => [
            offeringResult.insertId,
            employeeId,
            idAdmin,
        ]);

        const [employeeOfferingResult] = await this.db.query<ResultSetHeader>(
            "INSERT INTO employee_offering (id_offering, id_employee, id_admin) VALUES ?",
            [valuesToInsert],
        );

        if (!employeeOfferingResult.insertId)
            return null;

        const createdOffering = OfferingEntity
            .createFromDatabase({
                name: offering.data.name,
                value: offering.data.value,
                duration: offering.data.duration,
                id: offeringResult.insertId,
            });

        return createdOffering;
    };

    async updateOffering(offering: OfferingEntity): Promise<OfferingEntity | null> {
        const { id, name, duration, value, employeeIds, idAdmin } = offering.data;

        console.log("ID da Oferta:", id);
        console.log("Admin Logado:", idAdmin);
        console.log("IDs dos Funcionários que chegaram no Repo:", employeeIds);

        const [updateResult] = await this.db.execute<ResultSetHeader>(
            "UPDATE offering SET name = ?, value = ?, duration = ? WHERE id = ? LIMIT 1",
            [name, value, duration, id],
        );

        if (updateResult.affectedRows === 0)
            return null;

        await this.db.execute<ResultSetHeader>(
            "DELETE FROM employee_offering where id_offering = ? AND id_admin = ?",
            [id, idAdmin],
        );

        if (employeeIds && employeeIds.length > 0) {
            const valuesToUpdate = employeeIds?.map(employeeId => [
                id,
                employeeId,
                idAdmin,
            ]);
            
            await this.db.query<ResultSetHeader>(
                "INSERT INTO employee_offering (id_offering, id_employee, id_admin) VALUES ?",
                [valuesToUpdate],
            );
        }

        const updatedOffering = OfferingEntity.createFromDatabase({ ...offering.data });

        return updatedOffering;
    };

    async deleteOffering(id: OfferingEntityProps["id"]): Promise<boolean> {
        const [result] = await this.db.execute<ResultSetHeader>("DELETE FROM offering WHERE id = ?", [id]);

        const isDeleted = result.affectedRows > 0;

        return isDeleted;
    };
};