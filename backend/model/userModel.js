const getDatabaseConnection = require("../config/db");

const UserModel = {
  async addUser(name, user) {
    const db = getDatabaseConnection();

    try {
      const [result] = await db.execute(
        "INSERT INTO admin (name, email, password, city, state, phone)",
        [name, email, password, city, state, phone]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = UserModel;
