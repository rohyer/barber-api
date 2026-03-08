import redisClient from "../../../shared/config/redis-client.js";
import { EmployeeEntity } from "../employee.entity.js";
import { EmployeeRepository } from "../repository/employee.repository.js";
import { CreateEmployeeService, GetEmployeeService } from "./employee.service.type.js";

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
}