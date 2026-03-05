import { GetEmployeeDTO } from "../employee.dto.js";

export type GetEmployeeService = GetEmployeeDTO & {
    idAdmin: number;
    cacheKey: string | undefined;
};