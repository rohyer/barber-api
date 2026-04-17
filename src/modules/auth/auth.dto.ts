import z from "zod";

export const registerBarbeShopSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
    passwordConfirm: z.string(),
    city: z.string(),
    state: z.string(),
    phone: z.string(),
}).refine(data => data.password === data.passwordConfirm, {
    error: "A confirmação de senha deve ser igual à senha digitada",
    path: ["passwordConfirm"],
});

export type RegisterBarberShop = z.infer<typeof registerBarbeShopSchema>;