import { ResultSetHeader, RowDataPacket } from "mysql2";
import getDatabaseConnection from "../../shared/config/db.js";
import redisClient from "../../shared/config/redis-client.js";
import { IEmployee } from "./employee.type.js";

const EmployeeModel = {
  async getEmployees(idAdmin: IEmployee["idAdmin"]) {
    const db = getDatabaseConnection();

    const [result] = await db.execute<(IEmployee & RowDataPacket)[]>(
      "SELECT id, name, address, sex, phone, birth FROM employee WHERE id_admin = ?",
      [idAdmin],
    );
    return result;
  },

  async getEmployeeById(id: IEmployee["id"]) {
    const db = getDatabaseConnection();

    const [result] = await db.execute<(IEmployee & RowDataPacket)[]>(
      "SELECT id, name, address, sex, phone, birth, id_admin FROM employee WHERE id = ? LIMIT 1",
      [id],
    );
    return result;
  },

  async setEmployee({
    name,
    address,
    sex,
    phone,
    birth,
    idAdmin,
  }: Omit<IEmployee, "id">) {
    const db = getDatabaseConnection();

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO employee (name, address, sex, phone, birth, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
      [name, address, sex, phone, birth, idAdmin],
    );

    await redisClient.del(`employees:user:${idAdmin}`);
    return result;
  },

  async updateEmployee({
    name,
    address,
    sex,
    phone,
    birth,
    id,
    idAdmin,
  }: IEmployee) {
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

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM employee WHERE id = ?",
      [id],
    );

    await redisClient.del(`employees:user:${idAdmin}`);
    return result;
  },
};

export default EmployeeModel;
