export type Barbershop = {
    id: number;
    name: string;
    email: string;
    password: string;
    city: string;
    state: string;
    phone: string;
};

export type LoginBarbershop = Pick<Barbershop, "email" | "password">;