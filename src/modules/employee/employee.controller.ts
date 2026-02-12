import asyncHandler from "express-async-handler";
import EmployeeModel from "./employee.model.js";
import redisClient from "../../shared/config/redis-client.js";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Response as ExpressResponse } from "express";
import { successHandler } from "../../shared/utils/successHandler.js";
import { createError } from "../../shared/utils/createError.js";

/**
 * @description Get all employees
 * @route       GET /api/employees
 * @access      Private
 */
export const getEmployees = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) {
            res.status(401);
            throw new Error("Usuário não autenticado!");
        }

        const { page, query } = req.query;

        const offset = (page - 1) * 10;

        const data = await EmployeeModel.getEmployees(req.user.id, offset, query);

        if (req.cacheKey) await redisClient.set(req.cacheKey, JSON.stringify(data), { EX: 300 });

        const responseData = {
            status: 200,
            message: "Colaboradores listados com sucesso.",
            fromCache: false,
            data,
        };

        successHandler(res, responseData);
    },
);

/**
 * @description Register employee
 * @route       POST /api/employees
 * @access      Private
 */
export const registerEmployee = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) {
            res.status(401);
            throw new Error("Usuário não autenticado!");
        }

        const { name, address, sex, phone, birth } = req.body;

        if (!name || !address || !sex || !phone || !birth) {
            const error = {
                name: "UnfilledFields",
                message: "Por favor, preencha os campos.",
                status: 400,
            };

            throw createError(error);
        }

        const employeeData = {
            name,
            address,
            sex,
            phone,
            birth,
            idAdmin: req.user.id,
        };

        const result = await EmployeeModel.createEmployee(employeeData);

        const cacheKeys = await redisClient.keys(`employee:user:${req.user.id}:*`);

        if (cacheKeys.length > 0) await redisClient.del(cacheKeys);

        const responseData = {
            status: 201,
            message: "Colaborador cadastrado com sucesso.",
            fromCache: false,
            data: { ...result },
        };

        successHandler(res, responseData);
    },
);

/**
 * @description Update Employee
 * @route PUT /api/employees/:id
 * @access Private
 */
export const updateEmployee = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        const { name, address, sex, phone, birth } = req.body;

        if (!name || !address || !sex || !phone || !birth) {
            res.status(400);
            throw new Error("Por favor preencha os campos");
        }

        const employeeExists = await EmployeeModel.getEmployeeById(Number(req.params.id));

        if (!employeeExists || employeeExists.length === 0) {
            res.status(400);
            throw new Error("Colaborador não encontrado!");
        }

        if (!req.user) {
            res.status(400);
            throw new Error("Usuário não encontrado!");
        }

        if (employeeExists[0].idAdmin !== Number(req.user.id)) {
            res.status(400);
            throw new Error("Usuário não autorizado!");
        }

        const employeeData = {
            name,
            address,
            sex,
            phone,
            birth,
            id: Number(req.params.id),
            idAdmin: req.user.id,
        };

        await EmployeeModel.updateEmployee(employeeData);

        const cacheKeys = await redisClient.keys(`employee:user:${req.user.id}:*`);

        if (cacheKeys.length > 0) await redisClient.del(cacheKeys);

        const responseData = {
            status: 200,
            message: "Colaborador editado com sucesso",
            fromCache: false,
            data: employeeData,
        };

        successHandler(res, responseData);
    },
);

/**
 * @description Delete Employee
 * @route delete /api/employees/:id
 * @access Private
 */
export const deleteEmployee = asyncHandler(
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

        if (cacheKeys.length > 0) await redisClient.del(cacheKeys);

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
