import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { FindAllEmployeesParams, FindAllEmployeesResponse } from "./employee.repository.type.js";
import { EmployeeEntity, EmployeeEntityProps } from "../employee.entity.js";

export class EmployeeRepository {
    constructor(private readonly db: Pool) {};

    async findAllEmployees ({ idAdmin, offset, query }: FindAllEmployeesParams): Promise<FindAllEmployeesResponse | null> {
        const [employeeRows] = await this.db.execute<(EmployeeEntityProps & RowDataPacket)[]>(
            "SELECT e.id, e.name, e.address, e.sex, e.phone, e.birth, COUNT(cs.id) as totalAppointments, e.created_at AS createdAT FROM employee e LEFT JOIN customer_service cs ON e.id = cs.id_employee WHERE e.id_admin = ? AND (? = '' OR e.name LIKE CONCAT('%', ?, '%')) GROUP BY e.id, e.name, e.address, e.sex, e.phone, e.birth, e.created_at ORDER BY e.id DESC LIMIT 10 OFFSET ?",
            [idAdmin, query, query, offset],
        );

        const employees = employeeRows.map(employeeRow => EmployeeEntity.createFromDatabase(employeeRow));

        const [totalRows] = await this.db.execute<RowDataPacket[]>(
            "SELECT COUNT(*) AS total FROM employee WHERE id_admin = ? AND (? = '' OR name LIKE CONCAT('%', ?, '%'))",
            [idAdmin, query, query],
        );

        const total = totalRows[0].total as number;

        return {
            employees,
            total,
        };
    };

    async createEmployee(employee: EmployeeEntity): Promise<EmployeeEntity | null> {
        const { idAdmin, name, address, sex, phone, birth } = employee.data;

        const [result] = await this.db.execute<ResultSetHeader>(
            "INSERT INTO employee (name, address, sex, phone, birth, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
            [name, address, sex, phone, birth, idAdmin],
        );

        const createdEmployee = EmployeeEntity.createFromDatabase({ ...employee.data, id: result.insertId });

        return createdEmployee;
    }
}