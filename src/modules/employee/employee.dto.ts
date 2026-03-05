import z from "zod";

export const GetEmployeeSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    query: z.string().optional().default(""),
});

export type GetEmployeeDTO = z.infer<typeof GetEmployeeSchema>;