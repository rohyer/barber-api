import asyncHandler from "express-async-handler";
import EmployeeModel from "./employee.model.js";
import redisClient from "../../shared/config/redis-client.js";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Response as ExpressResponse } from "express";
import { successHandler } from "../../shared/utils/successHandler.js";
import { EmployeeService } from "./service/employee.service.js";

export class EmployeeController {
    constructor(private employeeService: EmployeeService) {};
    
    /**
     * @description Get all employees
     * @route       GET /api/employees
     * @access      Private
     */
    getEmployees = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const data = await this.employeeService.getEmployees({
            ...req.query,
            idAdmin: req.user!.id,
            cacheKey: req.cacheKey,
        });
    
        const responseData = {
            status: 200,
            message: "Colaboradores listados com sucesso.",
            fromCache: false,
            data,
        };
    
        return successHandler(res, responseData);
    });
    
    /**
     * @description Register employee
     * @route       POST /api/employees
     * @access      Private
     */
    registerEmployee = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const registeredEmployee = await this.employeeService.registerEmployee({
            ...req.body,
            idAdmin: req.user!.id,
            cacheKey: req.cacheKey,
        });
    
        const responseData = {
            status: 201,
            message: "Colaborador cadastrado com sucesso.",
            fromCache: false,
            data: { ...registeredEmployee },
        };
    
        return successHandler(res, responseData);
    });
    
    /**
     * @description Update Employee
     * @route PUT /api/employees/:id
     * @access Private
     */
    updateEmployee = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const updatedEmployee = await this.employeeService.updateEmployee({
            ...req.body,
            id: Number(req.params.id),
            idAdmin: req.user!.id,
        });

        const responseData = {
            status: 200,
            message: "Colaborador editado com sucesso",
            fromCache: false,
            data: { ...updatedEmployee },
        };
    
        return successHandler(res, responseData);
    });
    
    /**
     * @description Delete Employee
     * @route delete /api/employees/:id
     * @access Private
     */
    deleteEmployee = asyncHandler(
        async (req: AuthenticatedRequest, res: ExpressResponse) => {
            const employeeExists = await EmployeeModel.getEmployeeById(Number(req.params.id));
    
            if (!employeeExists || employeeExists.length === 0) {
                res.status(400);
                throw new Error("Colaborador não encontrado!");
            }
    
            if (!req.user) {
                res.status(400);
                throw new Error("Usuário encontrado");
            }
    
            if (employeeExists[0].idAdmin !== Number(req.user.id)) {
                res.status(400);
                throw new Error("Usuário não autorizado!");
            }
    
            await EmployeeModel.deleteEmployee(Number(req.params.id), req.user.id);
    
            const cacheKeys = await redisClient.keys(`employee:user:${req.user.id}:*`);
    
            if (cacheKeys.length > 0) 
                await redisClient.del(cacheKeys);
    
            const responseData = {
                status: 200,
                message: "Colaborador deletado com sucesso",
                fromCache: false,
                data: {
                    id: req.params.id,
                },
            };
    
            successHandler(res, responseData);
        },
    );
}
