import { CreateEmployeeDTO, GetEmployeeDTO, UpdateEmployeeDTO } from "../employee.dto.js";

export type GetEmployeeService = GetEmployeeDTO & {
    idAdmin: number;
    cacheKey: string | undefined;
};

export type CreateEmployeeService = CreateEmployeeDTO & {
    idAdmin: number;
    cacheKey: string | undefined;
};

export type UpdateEmployeeService = UpdateEmployeeDTO & {
    idAdmin: number;
    id: number;
};