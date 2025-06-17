import { ResultSetHeader, RowDataPacket } from "mysql2";
import getDatabaseConnection from "../../shared/config/db.js";
import redisClient from "../../shared/config/redis-client.js";
import { ICustomerServices } from "./customer-service.types.js";

const CustomerServiceModel = {
  async getCustomerServices(idAdmin: ICustomerServices["idAdmin"]) {
    const db = getDatabaseConnection();

    const [result] = await db.execute(
      "SELECT cs.id, cs.date, cs.time, c.phone, c.name as client, s.name as service, e.name as employee FROM customer_service cs JOIN client c ON cs.id_client = c.id JOIN service s ON cs.id_service = s.id JOIN employee e ON cs.id_employee = e.id WHERE cs.id_admin = ? ORDER BY cs.date, cs.time",
      [idAdmin],
    );
    return result;
  },

  async getCustomerServiceById(id: ICustomerServices["id"]) {
    const db = getDatabaseConnection();

    const [result] = await db.execute<(ICustomerServices & RowDataPacket)[]>(
      "SELECT id, date, time, status, id_service, id_client, id_employee, id_admin FROM customer_service WHERE id = ? LIMIT 1",
      [id],
    );
    return result;
  },

  async createCustomerService({
    date,
    time,
    idService,
    idClient,
    idEmployee,
    idAdmin,
  }: Omit<ICustomerServices, "id" | "status">) {
    const db = getDatabaseConnection();

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO customer_service (date, time, id_service, id_client, id_employee, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
      [date, time, idService, idClient, idEmployee, idAdmin],
    );
    await redisClient.del(`customer-services:user:${idAdmin}`);
    return result;
  },

  async updateCustomerService({
    date,
    time,
    idService,
    idClient,
    idEmployee,
    id,
    idAdmin,
  }: Omit<ICustomerServices, "status">) {
    const db = getDatabaseConnection();

    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE customer_service SET date = ?, time = ?, id_service = ?, id_client = ?, id_employee = ? WHERE id = ?",
      [date, time, idService, idClient, idEmployee, id],
    );

    await redisClient.del(`customer-services:user:${idAdmin}`);
    return result;
  },

  async deleteCustomerService(
    id: ICustomerServices["id"],
    idAdmin: ICustomerServices["idAdmin"],
  ) {
    const db = getDatabaseConnection();

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM customer_service WHERE id = ?",
      [id],
    );

    await redisClient.del(`customer-services:user:${idAdmin}`);
    return result;
  },
};

export default CustomerServiceModel;
