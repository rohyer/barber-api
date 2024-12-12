const getDatabaseConnection = require("../config/db");

const ClientModel = {
  async getClients(idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT id, name, sex, phone, address, birth FROM client WHERE id_admin = ?",
        [idAdmin]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getClientById(id) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT id, name, sex, phone, address, birth FROM client WHERE id = ? LIMIT 1",
        [id]
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
  },

  async updateClient(name, sex, phone, address, birth, id) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "UPDATE client SET name = ?, sex = ?, phone = ?, address = ?, birth = ? WHERE id = ?",
        [name, sex, phone, address, birth, id]
      );

      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteClient(id) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute("DELETE FROM client WHERE id = ?", [
        id
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = ClientModel;
