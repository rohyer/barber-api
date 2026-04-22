import z from "zod";
import { Barbershop, LoginBarbershop } from "../auth.type.js";

export const registerBarbershopSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
    passwordConfirm: z.string(),
    city: z.string(),
    state: z.string(),
    phone: z.string(),
}) satisfies z.ZodType<Barbershop>;

export const registerBarbershopInputSchema = registerBarbershopSchema
    .extend({ passowrdConfirm: z.string() })
    .refine(data => data.password === data.passwordConfirm, {
        error: "A confirmação deve ser igual a senha digitada",
        path: ["passwordConfirm"],
    });

export const loginBarbershopSchema = z.object({
    email: z.email(),
    password: z.string(),
}) satisfies z.ZodType<LoginBarbershop>;