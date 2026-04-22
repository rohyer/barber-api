import bcrypt from "bcryptjs";

export class HashService {
    hash = async (password: string): Promise<string> => {
        const salt = await bcrypt.genSalt(10);

        const passwordHashed = await bcrypt.hash(password, salt);

        return passwordHashed;
    };

    compare = async (plain: string, hashed: string): Promise<boolean> => {
        const isEqual = await bcrypt.compare(plain, hashed);

        return isEqual;
    };
}