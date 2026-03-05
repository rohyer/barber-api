import { EmployeeEntity } from "../employee.entity.js";

export type FindAllEmployeesParams = {
    idAdmin: number;
    offset: number;
    query: string;
};

export type FindAllEmployeesResponse = {
    employees: EmployeeEntity[];
    total: number;
};