import redisClient from "../../../shared/config/redis-client.js";
import { EmployeeEntity } from "../employee.entity.js";
import { EmployeeRepository } from "../repository/employee.repository.js";
import { CreateEmployeeService, DeleteEmployeeService, GetEmployeeService, UpdateEmployeeService } from "./employee.service.type.js";

export class EmployeeService {
    constructor(private employeeRepository: EmployeeRepository) {}

    getEmployees = async (data: GetEmployeeService) => {
        const offset = (data.page - 1) * 10;

        const queryResult = await this.employeeRepository.findAllEmployees({
            idAdmin: data.idAdmin,
            offset,
            query: data.query,
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

        const cacheKeys = await redisClient.keys(`client:user:${data.idAdmin}:*`);

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

        const cacheKeys = await redisClient.keys(`client:user:${data.idAdmin}:*`);

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

        const cacheKeys = await redisClient.keys(`client:user:${data.idAdmin}:*`);

        if (cacheKeys.length > 0)
            await redisClient.del(cacheKeys);

        return isDeletedClient;
    };
}