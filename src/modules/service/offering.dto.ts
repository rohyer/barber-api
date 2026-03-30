import z, { array, number, string } from "zod";

export const GetOfferingSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    query: z.string().optional().default(""),
});

export const CreateOfferingSchema = z.object({
    name: string().min(1, "Insira um nome válido"),
    value: number().min(1, "Insira um valor válido"),
    duration: number().min(1, "Insira uma duração válida"),
    idEmployees: array(number().min(1, "Insira um colaborador válido")),
});

export const ParamsSchema = z.object({
    id: z.string().regex(/^\d+$/, "ID deve ser numérico"),
});

export const UpdateOfferingSchema = CreateOfferingSchema;

export type GetOfferingDTO = z.infer<typeof GetOfferingSchema>;

export type CreateOfferingDTO = z.infer<typeof CreateOfferingSchema>;

export type UpdateOfferingDTO = z.infer<typeof UpdateOfferingSchema>;

export type DeleteOfferingDTO = z.infer<typeof ParamsSchema>;