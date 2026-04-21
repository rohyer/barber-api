export type Barbershop = {
    name: string;
    email: string;
    password: string;
    city: string;
    state: string;
    phone: string;
};

export type LoginBarbershop = Pick<Barbershop, "email" | "password">;