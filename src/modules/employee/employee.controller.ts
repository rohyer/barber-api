import asyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Response as ExpressResponse } from "express";
import { successHandler } from "../../shared/utils/successHandler.js";
import { EmployeeService } from "./employee.service.js";

export class EmployeeController {
    constructor(private employeeService: EmployeeService) {};
    
    /**
     * @description Get all employee names
     * @route       GET /api/employees
     * @access      Private
     */
    getEmployeeOptions = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const data = await this.employeeService.getEmployeeOptions({ idAdmin: req.user!.id });
    
        const responseData = {
            status: 200,
            message: "Colaboradores listados com sucesso.",
            fromCache: false,
            data,
        };
    
        return successHandler(res, responseData);
    });
    
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
    deleteEmployee = asyncHandler(async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const isDeletedEmployee = await this.employeeService.deleteEmployee({
            id: req.params.id,
            idAdmin: req.user!.id,
        });

        if (!isDeletedEmployee)
            throw new Error("Erro ao deletar colaborador");

        const responseData = {
            status: 200,
            message: "Colaborador deletado com sucesso",
            fromCache: false,
            data: { 
                id: req.params.id,
            },
        };
    
        return successHandler(res, responseData);
    });
}
