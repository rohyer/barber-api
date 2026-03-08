import z from "zod";

export const GetEmployeeSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    query: z.string().optional().default(""),
});

export const CreateEmployeeSchema = z.object({
    name: z.string().min(1, "Preencha o campo nome"),
    address: z.string().min(1, "Preencha o campo endereço"),
    sex: z.enum(["M", "F", "Outro"]),
    phone: z.string().min(1, "Preencha o campo telefone"),
    birth: z.string().min(1, "Preencha o campo data de nascimento"),

});

export type GetEmployeeDTO = z.infer<typeof GetEmployeeSchema>;

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;