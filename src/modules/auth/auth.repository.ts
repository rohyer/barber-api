import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { RegisterBarberShop } from "./auth.dto.js";
import { AuthEntity, AuthEntityProps } from "./auth.entity.js";

export class AuthRepository {
    constructor(private readonly db: Pool) {}

    isEmailAvailable = async (email: string): Promise<boolean> => {
        const query = "SELECT id FROM admin WHERE email = ? LIMIT 1";

        const [rows] = await this.db.execute<AuthEntityProps["id"] & RowDataPacket[]>(
            query,
            [email],
        );

        if (rows.length === 0)
            return true;

        return false;
    };

    insertBarbershop = async (barbershopData: RegisterBarberShop): Promise<AuthEntity | null> => {
        const { name, email, password, phone, city, state } = barbershopData;

        const query = "INSERT INTO admin (name, email, password, phone, city, state) VALUES (?, ?, ?, ?, ?, ?)";

        const [result] = await this.db.execute<ResultSetHeader>(
            query,
            [name, email, password, phone, city, state],
        );

        if (!result.insertId)
            return null;

        const entity = AuthEntity.createFromDatabase({ name, email, password, phone, city, state });

        return entity;
    };
}