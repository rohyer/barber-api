import redisClient from "../../shared/config/redis-client.js";
import { EmployeeEntity } from "./employee.entity.js";
import { EmployeeRepository } from "./employee.repository.js";
import { CreateEmployeeDTO, DeleteEmployeeDTO, GetEmployeeDTO, UpdateEmployeeDTO } from "./employee.dto.js";

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

export type DeleteEmployeeService = DeleteEmployeeDTO & {
    idAdmin: number;
};

export class EmployeeService {
    constructor(private employeeRepository: EmployeeRepository) {}

    getEmployees = async (data: GetEmployeeService) => {
        const offset = (data.page - 1) * 10;

        const queryResult = await this.employeeRepository.findAllEmployees({
            idAdmin: data.idAdmin,
            query: data.query,
            offset,
        });

        if (!queryResult)
            return null;

        const employees = queryResult.employees.map(employee => employee.data);

        const result = {
            employees,
            total: queryResult.total,
        };
        
        if (data.cacheKey)
            await redisClient.set(data.cacheKey, JSON.stringify(result), { EX: 300 });

        return result;
    };

    registerEmployee = async (data: CreateEmployeeService) => {
        const employee = new EmployeeEntity({ ...data });

        const queryResult = await this.employeeRepository.createEmployee(employee);

        if (!queryResult || !queryResult.data.id)
            return null;

        const cacheKeys = await redisClient.keys(`employee:user:${data.idAdmin}:*`);

        if (cacheKeys.length > 0)
            await redisClient.del(cacheKeys);

        return queryResult;
    };

    updateEmployee = async(data: UpdateEmployeeService) => {
        const employee = await this.employeeRepository.findEmployeeById(data.id);

        if (!employee || !employee.data.id)
            throw new Error("Colaborador não encontrado");

        if (employee.data.idAdmin !== data.idAdmin)
            throw new Error("Usuário não autorizado");

        employee.update({
            name: data.name,
            sex: data.sex,
            phone: data.phone,
            address: data.address,
            birth: data.birth,
        });

        const updatedEmployee = await this.employeeRepository.updateEmployee(employee);

        if (!updatedEmployee)
            return null;

        const cacheKeys = await redisClient.keys(`employee:user:${data.idAdmin}:*`);

        if (cacheKeys.length > 0) 
            await redisClient.del(cacheKeys);

        return { data: updatedEmployee };
    };

    deleteEmployee = async(data: DeleteEmployeeService) => {
        const employee = await this.employeeRepository.findEmployeeById(Number(data.id));

        if (!employee || !employee.data.id)
            throw new Error("Colaborador não encontrado");

        if (employee.data.idAdmin !== data.idAdmin)
            throw new Error("Usuário não autorizado");

        const isDeletedClient = await this.employeeRepository.deleteEmployee(employee.data.id);

        const cacheKeys = await redisClient.keys(`employee:user:${data.idAdmin}:*`);

        if (cacheKeys.length > 0)
            await redisClient.del(cacheKeys);

        return isDeletedClient;
    };
}