const getDatabaseConnection = require("../config/db");

const CustomerServiceModel = {
  async getCustomerServices(idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT cs.id, cs.date, cs.time, c.phone, c.name as client, s.name as service, e.name as employee FROM customer_service cs JOIN client c ON cs.id_client = c.id JOIN service s ON cs.id_service = s.id JOIN employee e ON cs.id_employee = e.id ORDER BY cs.date, cs.time",
        []
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getCustomerServiceById(id) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT * FROM customer_service WHERE id = ? LIMIT 1",
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async createCustomerService(
    date,
    time,
    idService,
    idClient,
    idEmployee,
    idAdmin
  ) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "INSERT INTO customer_service (date, time, id_service, id_client, id_employee, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
        [date, time, idService, idClient, idEmployee, idAdmin]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async updateCustomerService(date, time, status, idService, idEmployee, id) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "UPDATE customer_service SET date = ?, time = ?, status = ?, id_service = ?, id_employee = ? WHERE id = ?",
        [date, time, status, idService, idEmployee, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteCustomerService(id) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "DELETE FROM customer_service WHERE id = ?",
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = CustomerServiceModel;
