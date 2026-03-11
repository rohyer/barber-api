import z, { number, string } from "zod";

export const GetOfferingSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    query: z.string().optional().default(""),
});

export const CreateOfferingSchema = z.object({
    name: string().min(1, "Insira um nome válido"),
    value: number().min(1, "Insira um valor válido"),
});

export const UpdateOfferingSchema = CreateOfferingSchema;

export type GetOfferingDTO = z.infer<typeof GetOfferingSchema>;

export type CreateOfferingDTO = z.infer<typeof CreateOfferingSchema>;

export type UpdateOfferingDTO = z.infer<typeof UpdateOfferingSchema>;