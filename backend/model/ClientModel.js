const getDatabaseConnection = require("../config/db");

const ClientModel = {
  async getClients(idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT * FROM client WHERE id_admin = ?",
        [idAdmin]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async createClient(name, sex, phone, address, birth, idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "INSERT INTO client (name, sex, phone, address, birth, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
        [name, sex, phone, address, birth, idAdmin]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = ClientModel;
