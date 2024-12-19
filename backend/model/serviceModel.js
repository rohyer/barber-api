const getDatabaseConnection = require("../config/db");
const redisClient = require("../config/redisClient");

const ServiceModel = {
  async createService(name, value, idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "INSERT INTO service (name, value, id_admin) VALUES (?, ?, ?)",
        [name, value, idAdmin]
      );

      await redisClient.del(`services:user:${idAdmin}`);
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

  async getServiceById(id) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT id, name, value, id_admin FROM service WHERE id = ? LIMIT 1",
        [id]
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
        "SELECT id, name, value FROM service WHERE id_admin = ?",
        [idAdmin]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async updateService(name, value, id, idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "UPDATE service SET name = ?, value = ? WHERE id = ? LIMIT 1",
        [name, value, id]
      );

      await redisClient.del(`services:user:${idAdmin}`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteService(id, idAdmin) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute("DELETE FROM service WHERE id = ?", [
        id
      ]);

      await redisClient.del(`services:user:${idAdmin}`);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = ServiceModel;
