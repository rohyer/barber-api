import { z } from "zod";

export const CreateClientSchema = z.object({
    name: z.string().min(1, "Preencha o campo nome"),
    sex: z.enum(["M", "F", "Outro"]),
    phone: z.string().min(1, "Preencha o campo telefone"),
    address: z.string().min(1, "Preencha o campo endereço"),
    birth: z.string().min(1, "Preencha o campo data de nascimento"),
});

export const UpdateClientSchema = CreateClientSchema;

export const GetClientsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    query: z.string().optional().default(""),
});

export const ParamsSchema = z.object({
    id: z.string().regex(/^\d+$/, "ID deve ser numérico"),
});

export type CreateClientDTO = z.infer<typeof CreateClientSchema>;

export type UpdateClientDTO = z.infer<typeof UpdateClientSchema>;

export type GetClientsDTO = z.infer<typeof GetClientsSchema>;

export type DeleteClientDTO = z.infer<typeof ParamsSchema>;