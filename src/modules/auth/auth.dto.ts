import z from "zod";

export const registerBarbeShopSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
    passwordConfirm: z.string(),
    city: z.string(),
    state: z.string(),
    phone: z.string(),
});

export type RegisterBarberShop = z.infer<typeof registerBarbeShopSchema>;