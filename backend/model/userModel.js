const getDatabaseConnection = require("../config/db");

const UserModel = {
  async addUser(name, email, password, city, state, phone) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "INSERT INTO admin (name, email, password, city, state, phone) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, password, city, state, phone]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getUser(email) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT * FROM admin WHERE email = ? LIMIT 1",
        [email]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getUserById(id) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT * FROM admin WHERE id = ? LIMIT 1",
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = UserModel;
