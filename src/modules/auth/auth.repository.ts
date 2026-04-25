import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { AuthEntity, AuthEntityInput, AuthEntityProps } from "./auth.entity.js";

export class AuthRepository {
    constructor(private readonly db: Pool) {}

    isEmailRegistered = async (email: string): Promise<boolean> => {
        const query = "SELECT id FROM admin WHERE email = ? LIMIT 1";

        const [rows] = await this.db.execute<AuthEntityProps["id"] & RowDataPacket[]>(
            query,
            [email],
        );

        if (rows.length === 0)
            return false;

        return true;
    };

    insertBarbershop = async (barbershopData: AuthEntityInput): Promise<AuthEntity | null> => {
        const { name, email, password, phone, city, state } = barbershopData;

        const query = "INSERT INTO admin (name, email, password, phone, city, state) VALUES (?, ?, ?, ?, ?, ?)";

        const [result] = await this.db.execute<ResultSetHeader>(
            query,
            [name, email, password, phone, city, state],
        );

        if (!result.insertId)
            return null;

        const entity = AuthEntity.createFromDatabase({
            id: result.insertId,
            name,
            email,
            password,
            phone,
            city,
            state,
        });

        return entity;
    };

    findUserByEmail = async (email: AuthEntityProps["email"]): Promise<AuthEntity | null> => {
        const [result] = await this.db.execute<AuthEntityProps & RowDataPacket[]>(
            "SELECT id, name, email, password, city, state, phone, premium_expires_at as premiumExpiresAt from admin WHERE email = ? LIMIT 1",
            [email],
        );

        if (result.length === 0)
            return null;

        const userEntity = AuthEntity.createFromDatabase({ ...result[0] });

        return userEntity;
    };
}