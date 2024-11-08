const getDatabaseConnection = require("../config/db");

const ServiceModel = {
  async createService(name, value, idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "INSERT INTO service (name, value, id_admin) VALUES (?, ?, ?)",
        [name, value, idAdmin]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getServiceByName(name) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT name FROM service WHERE name = ? LIMIT 1",
        [name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getServices(idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT * FROM service WHERE id_admin = ?",
        [idAdmin]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = ServiceModel;
