import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { EmployeeEntity, EmployeeEntityProps } from "./employee.entity.js";

export type FindAllEmployeesParams = {
    idAdmin: number;
    offset: number;
    query: string;
};

export type FindAllEmployeesResponse = {
    employees: EmployeeEntity[];
    total: number;
};

export class EmployeeRepository {
    constructor(private readonly db: Pool) {};

    findAllEmployeeOptions = async (idAdmin: FindAllEmployeesParams["idAdmin"]) => {
        const [employeeNameRows] = await this.db.execute<(Pick<EmployeeEntityProps, "id" | "name">  & RowDataPacket)[]>(
            "SELECT id, name from employee WHERE id_admin = ?",
            [idAdmin],
        );

        console.log(employeeNameRows);

        const employees = employeeNameRows.map(employeeNameRow => EmployeeEntity.createFromDatabase(employeeNameRow));

        return { employees };
    };

    findAllEmployees = async ({ idAdmin, offset, query }: FindAllEmployeesParams): Promise<FindAllEmployeesResponse | null> => {
        const [employeeRows] = await this.db.execute<(EmployeeEntityProps & RowDataPacket)[]>(
            "SELECT e.id, e.name, e.address, e.sex, e.phone, e.birth, COUNT(a.id) as totalAppointments, e.created_at AS createdAT FROM employee e LEFT JOIN appointment a ON e.id = a.id_employee WHERE e.id_admin = ? AND (? = '' OR e.name LIKE CONCAT('%', ?, '%')) GROUP BY e.id, e.name, e.address, e.sex, e.phone, e.birth, e.created_at ORDER BY e.id DESC LIMIT 10 OFFSET ?",
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

    findEmployeeById = async (id: EmployeeEntityProps["id"]): Promise<EmployeeEntity | null> => {
        const [employeeRows] = await this.db.execute<(EmployeeEntityProps & RowDataPacket)[]>(
            "SELECT id, name, address, sex, phone, birth, id_admin AS idAdmin FROM employee WHERE id = ? LIMIT 1",
            [id],
        );

        if (employeeRows.length === 0)
            return null;

        const createdEmployee = EmployeeEntity.createFromDatabase(employeeRows[0]);

        return createdEmployee;
    };

    createEmployee = async (employee: EmployeeEntity): Promise<EmployeeEntity | null> =>  {
        const { idAdmin, name, address, sex, phone, birth } = employee.data;

        const [result] = await this.db.execute<ResultSetHeader>(
            "INSERT INTO employee (name, address, sex, phone, birth, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
            [name, address, sex, phone, birth, idAdmin],
        );

        const createdEmployee = EmployeeEntity.createFromDatabase({ ...employee.data, id: result.insertId });

        return createdEmployee;
    };

    updateEmployee = async (employee: EmployeeEntity): Promise<EmployeeEntity | null> => {
        const { name, sex, phone, address, birth, id } = employee.data;

        const [result] = await this.db.execute<ResultSetHeader>(
            "UPDATE employee SET name = ?, sex = ?, phone = ?, address = ?, birth = ? WHERE id = ?",
            [name, sex, phone, address, birth, id],
        );

        if (result.affectedRows === 0)
            return null;

        const updatedEmployee = EmployeeEntity.createFromDatabase({ ...employee.data });

        return updatedEmployee;
    };

    deleteEmployee = async (id: EmployeeEntityProps["id"]): Promise<boolean> => {
        const [result] = await this.db.execute<ResultSetHeader>("DELETE FROM employee WHERE id = ?", [id]);

        const isDeleted = result.affectedRows > 0;

        return isDeleted;
    };
}