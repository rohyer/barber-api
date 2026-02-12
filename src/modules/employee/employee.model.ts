import { ResultSetHeader, RowDataPacket } from "mysql2";
import getDatabaseConnection from "../../shared/config/db.js";
import redisClient from "../../shared/config/redis-client.js";
import { IEmployee } from "./employee.type.js";

const EmployeeModel = {
    async getEmployees(idAdmin: IEmployee["idAdmin"], offset: number, query: string) {
        const db = getDatabaseConnection();

        const [result] = await db.execute<(IEmployee & RowDataPacket)[]>(
            "SELECT e.id, e.name, e.address, e.sex, e.phone, e.birth, COUNT(cs.id) as totalAppointments, e.created_at AS createdAT FROM employee e LEFT JOIN customer_service cs ON e.id = cs.id_employee WHERE e.id_admin = ? AND (? = '' OR e.name LIKE CONCAT('%', ?, '%')) GROUP BY e.id, e.name, e.address, e.sex, e.phone, e.birth, e.created_at ORDER BY e.id DESC LIMIT 10 OFFSET ?",
            [idAdmin, query, query, offset],
        );

        const [rows] = await db.execute<RowDataPacket[]>(
            "SELECT COUNT(*) AS total FROM employee WHERE id_admin = ? AND (? = '' OR name LIKE CONCAT('%', ?, '%'))",
            [idAdmin, query, query],
        );

        const total = rows[0].total as number;

        return {
            employees: result,
            total,
        };
    },

    async getEmployeeById(id: IEmployee["id"]): Promise<(IEmployee & RowDataPacket)[] | null> {
        const db = getDatabaseConnection();

        const [result] = await db.execute<(IEmployee & RowDataPacket)[]>(
            "SELECT id, name, address, sex, phone, birth, id_admin AS idAdmin FROM employee WHERE id = ? LIMIT 1",
            [id],
        );

        return result;
    },

    async createEmployee({ name, address, sex, phone, birth, idAdmin }: Omit<IEmployee, "id">) {
        const db = getDatabaseConnection();

        const [result] = await db.execute<ResultSetHeader>(
            "INSERT INTO employee (name, address, sex, phone, birth, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
            [name, address, sex, phone, birth, idAdmin],
        );

        await redisClient.del(`employees:user:${idAdmin}`);
        return result;
    },

    async updateEmployee({ name, address, sex, phone, birth, id, idAdmin }: IEmployee) {
        const db = getDatabaseConnection();

        const [result] = await db.execute<ResultSetHeader>(
            "UPDATE employee SET name = ?, address = ?, sex = ?, phone = ?, birth = ? WHERE id = ?",
            [name, address, sex, phone, birth, id],
        );

        await redisClient.del(`employees:user:${idAdmin}`);
        return result;
    },

    async deleteEmployee(id: IEmployee["id"], idAdmin: IEmployee["idAdmin"]) {
        const db = getDatabaseConnection();

        const [result] = await db.execute<ResultSetHeader>("DELETE FROM employee WHERE id = ?", [
            id,
        ]);

        await redisClient.del(`employees:user:${idAdmin}`);
        return result;
    },
};

export default EmployeeModel;
