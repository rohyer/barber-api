import getDatabaseConnection from "../../shared/config/db.js";

import { ResultSetHeader, RowDataPacket } from "mysql2";
import { IUser } from "./user.type.js";

const UserModel = {
    async getUser(email: IUser["email"]): Promise<IUser[]> {
        const db = getDatabaseConnection();

        const [result] = await db.execute<RowDataPacket[]>(
            "SELECT id, name, email, password, city, state, phone, new_email AS newEmail, email_token AS emailToken, email_token_expires AS emailTokenExpires, status, premium_expires_at AS premiumExpiresAt, created_at AS createdAt, updated_at AS updatedAt FROM admin WHERE email = ? LIMIT 1",
            [email],
        );

        return result as IUser[];
    },

    async getUserById(id: IUser["id"]): Promise<IUser[]> {
        const db = getDatabaseConnection();

        const [result] = await db.execute<RowDataPacket[]>(
            "SELECT id, name, email, password, city, state, phone, new_email AS newEmail, email_token AS emailToken, email_token_expires AS emailTokenExpires, status, premium_expires_at AS premiumExpiresAt, created_at AS createdAt, updated_at AS updatedAt FROM admin WHERE id = ? LIMIT 1",
            [id],
        );

        return result as IUser[];
    },

    async addUser({
        name,
        email,
        password,
        city,
        state,
        phone,
        premiumExpiresAt,
    }: Omit<
        IUser,
        | "id"
        | "newEmail"
        | "emailToken"
        | "emailTokenExpires"
        | "status"
        | "createdAt"
        | "updatedAt"
    >) {
        const db = getDatabaseConnection();

        const [result] = await db.execute<ResultSetHeader>(
            "INSERT INTO admin (name, email, password, city, state, phone, premium_expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, email, password, city, state, phone, premiumExpiresAt],
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
        | "premiumExpiresAt"
        | "createdAt"
        | "updatedAt"
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

    async removePremiumAccess(premiumExpiresAt: Date | null, id: IUser["id"]) {
        const db = getDatabaseConnection();

        await db.execute<ResultSetHeader>(
            "UPDATE admin SET premium_expires_at = ?, status = 0 WHERE id = ?",
            [premiumExpiresAt, id],
        );
    },

    async saveEmailChangeRequest({
        newEmail,
        emailToken,
        emailTokenExpires,
        id,
    }: Omit<
        IUser,
        | "name"
        | "email"
        | "password"
        | "city"
        | "state"
        | "phone"
        | "status"
        | "premiumExpiresAt"
        | "createdAt"
        | "updatedAt"
    >) {
        const db = getDatabaseConnection();

        await db.execute<ResultSetHeader>(
            "UPDATE admin SET new_email = ?, email_token = ?, email_token_expires = ? WHERE id = ?",
            [newEmail, emailToken, emailTokenExpires, id],
        );
    },

    async getUserByEmailToken(emailToken: IUser["emailToken"]): Promise<IUser> {
        const db = getDatabaseConnection();

        const [result] = await db.execute<RowDataPacket[]>(
            "SELECT id, name, email, password, city, state, phone, new_email AS newEmail, email_token AS emailToken, email_token_expires AS emailTokenExpires, status, created_at AS createdAt, updated_at AS updatedAt FROM admin where email_token = ?",
            [emailToken],
        );

        return result[0] as IUser;
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
