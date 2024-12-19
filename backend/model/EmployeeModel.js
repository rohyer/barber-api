const getDatabaseConnection = require("../config/db");
const redisClient = require("../config/redisClient");

const EmployeeModel = {
  async getEmployees(idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT id, name, address, sex, phone, birth FROM employee WHERE id_admin = ?",
        [idAdmin]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getEmployeeById(id) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT id, name, address, sex, phone, birth, id_admin FROM employee WHERE id = ? LIMIT 1",
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async setEmployee(name, address, sex, phone, birth, idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "INSERT INTO employee (name, address, sex, phone, birth, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
        [name, address, sex, phone, birth, idAdmin]
      );

      await redisClient.del(`employees:user:${idAdmin}`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async updateEmployee(name, address, sex, phone, birth, id, idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result, field] = await db.execute(
        "UPDATE employee SET name = ?, address = ?, sex = ?, phone = ?, birth = ? WHERE id = ?",
        [name, address, sex, phone, birth, id]
      );

      await redisClient.del(`employees:user:${idAdmin}`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteEmployee(id, idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute("DELETE FROM employee WHERE id = ?", [
        id
      ]);

      await redisClient.del(`employees:user:${idAdmin}`);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = EmployeeModel;
