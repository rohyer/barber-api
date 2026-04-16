import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { RegisterBarberShop } from "./auth.dto.js";

export class AuthRepository {
    constructor(private readonly db: Pool) {}

    getUserByEmail = async (email: string): Promise<RowDataPacket[]> => {
        const query = "SELECT id FROM admin WHERE email = ? LIMIT 1";

        const [rows] = await this.db.execute<RowDataPacket[]>(query, [email]);

        return rows;
    };

    insertBarbershop = (barbershopData: RegisterBarberShop) => {
        const { name, email, password, passwordConfirm, phone, city, state } = barbershopData;

        const query = "INSERT INTO admin (name, email, password, passwordConfirm, phone, city, state) VALUES (?, ?, ?, ?, ?, ?, ?)";

        const result = this.db.execute<ResultSetHeader>(
            query,
            [name, email, password, passwordConfirm, phone, city, state],
        );

        return result;
    };
}