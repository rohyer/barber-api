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
  },

  async updateUserData(name, city, state, phone, id) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "UPDATE admin SET name = ?, city = ?, state = ?, phone = ? WHERE id = ?",
        [name, city, state, phone, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async updateUserPassword(password, id) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "UPDATE admin SET password = ? WHERE id = ?",
        [password, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async saveEmailChangeRequest(newEmail, token, expires, id) {
    const db = getDatabaseConnection();

    try {
      await db.execute(
        "UPDATE admin SET new_email = ?, email_token = ?, email_token_expires = ? WHERE id = ?",
        [newEmail, token, expires, id]
      );
    } catch (error) {
      throw error;
    }
  },

  async getUserByEmailToken(token) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "SELECT * FROM admin where email_token = ?",
        [token]
      );
      return result[0];
    } catch (error) {
      throw error;
    }
  },

  async updateUserEmail(newEmail, id) {
    const db = getDatabaseConnection();

    try {
      await db.execute(
        "UPDATE admin SET email = ?, new_email = NULL, email_token = NULL, email_token_expires = NULL WHERE id = ?",
        [newEmail, id]
      );
    } catch (error) {
      throw error;
    }
  }
};

module.exports = UserModel;
