import getDatabaseConnection from "../../shared/config/db.js";

import { ResultSetHeader, RowDataPacket } from "mysql2";
import { IUser } from "./user.type.js";

const UserModel = {
  async getUser(email: IUser["email"]) {
    const db = getDatabaseConnection();

    const [result] = await db.execute<(IUser & RowDataPacket)[]>(
      "SELECT * FROM admin WHERE email = ? LIMIT 1",
      [email],
    );
    return result;
  },

  async getUserById(id: IUser["id"]): Promise<RowDataPacket[]> {
    const db = getDatabaseConnection();

    const [result] = await db.execute<(IUser & RowDataPacket)[]>(
      "SELECT * FROM admin WHERE id = ? LIMIT 1",
      [id],
    );
    return result;
  },

  async addUser({
    name,
    email,
    password,
    city,
    state,
    phone,
  }: Omit<
    IUser,
    "id" | "newEmail" | "emailToken" | "emailTokenExpires" | "status"
  >) {
    const db = getDatabaseConnection();

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO admin (name, email, password, city, state, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, password, city, state, phone],
    );
    return result;
  },

  async updateUserData({
    name,
    city,
    state,
    phone,
    id,
  }: Omit<
    IUser,
    | "email"
    | "newEmail"
    | "password"
    | "emailToken"
    | "emailTokenExpires"
    | "status"
  >) {
    const db = getDatabaseConnection();

    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE admin SET name = ?, city = ?, state = ?, phone = ? WHERE id = ?",
      [name, city, state, phone, id],
    );
    return result;
  },

  async updateUserPassword(password: IUser["password"], id: IUser["id"]) {
    const db = getDatabaseConnection();

    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE admin SET password = ? WHERE id = ?",
      [password, id],
    );
    return result;
  },

  async saveEmailChangeRequest({
    newEmail,
    emailToken,
    emailTokenExpires,
    id,
  }: Omit<
    IUser,
    "name" | "email" | "password" | "city" | "state" | "phone" | "status"
  >) {
    const db = getDatabaseConnection();

    await db.execute<ResultSetHeader>(
      "UPDATE admin SET new_email = ?, email_token = ?, email_token_expires = ? WHERE id = ?",
      [newEmail, emailToken, emailTokenExpires, id],
    );
  },

  async getUserByEmailToken(emailToken: IUser["emailToken"]) {
    const db = getDatabaseConnection();

    const [result] = await db.execute<(IUser & RowDataPacket)[]>(
      "SELECT * FROM admin where email_token = ?",
      [emailToken],
    );
    return result[0];
  },

  async updateUserEmail(newEmail: IUser["newEmail"], id: IUser["id"]) {
    const db = getDatabaseConnection();

    await db.execute<ResultSetHeader>(
      "UPDATE admin SET email = ?, new_email = NULL, email_token = NULL, email_token_expires = NULL WHERE id = ?",
      [newEmail, id],
    );
  },
};

export default UserModel;
