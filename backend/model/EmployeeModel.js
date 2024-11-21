const getDatabaseConnection = require("../config/db");

const EmployeeModel = {
  async getEmployees(idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT * FROM employee WHERE id_admin = ?",
        [idAdmin]
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
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = EmployeeModel;
