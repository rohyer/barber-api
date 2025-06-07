import asyncHandler from "express-async-handler";
import EmployeeModel from "./employee.model.js";
import redisClient from "../../shared/config/redis-client.js";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Response as ExpressResponse } from "express";

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

    const employees = await EmployeeModel.getEmployees(req.user.id);

    if (req.cacheKey) {
      await redisClient.set(req.cacheKey, JSON.stringify(employees), {
        EX: 300,
      });
    }

    res.status(200).json(employees);
  },
);

/**
 * @description Register employee
 * @route       POST /api/employees
 * @access      Private
 */
export const setEmployee = asyncHandler(
  async (req: AuthenticatedRequest, res: ExpressResponse) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Usuário não autenticado!");
    }

    const { name, address, sex, phone, birth } = req.body;

    if (!name || !address || !sex || !phone || !birth) {
      res.status(400);
      throw new Error("Por favor, preencha os campos");
    }

    const employeeData = {
      name,
      address,
      sex,
      phone,
      birth,
      idAdmin: req.user.id,
    };

    const result = await EmployeeModel.setEmployee(employeeData);

    res.status(201);
    res.json({
      success: true,
      message: "Colaborador cadastrado com sucesso!",
      data: {
        employeeId: result.insertId,
      },
    });
  },
);

/**
 * @description Update Employee
 * @route PUT /api/employees/:id
 * @access Private
 */
export const updateEmployee = asyncHandler(
  async (req: AuthenticatedRequest, res: ExpressResponse) => {
    if (!req.user) {
      res.status(400);
      throw new Error("Usuário não encontrado!");
    }

    const { name, address, sex, phone, birth } = req.body;

    if (!name || !address || !sex || !phone || !birth) {
      res.status(400);
      throw new Error("Por favor preencha os campos");
    }

    const employeeExists = await EmployeeModel.getEmployeeById(
      Number(req.params.id),
    );

    if (employeeExists.length === 0) {
      res.status(400);
      throw new Error("Colaborador não encontrado!");
    }

    if (employeeExists[0].id_admin !== req.user.id) {
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

    const result = await EmployeeModel.updateEmployee(employeeData);

    res.status(200);
    res.json({
      success: true,
      message: "Colaborador atualizado com sucesso!",
      data: {
        affectedRows: result.affectedRows,
      },
    });
  },
);

/**
 * @description Delete Employee
 * @route delete /api/employees/:id
 * @access Private
 */
export const deleteEmployee = asyncHandler(
  async (req: AuthenticatedRequest, res: ExpressResponse) => {
    if (!req.user) {
      res.status(400);
      throw new Error("Usuário não encontrado");
    }

    const employeeExists = await EmployeeModel.getEmployeeById(
      Number(req.params.id),
    );

    if (employeeExists.length === 0) {
      res.status(400);
      throw new Error("Colaborador não encontrado!");
    }

    if (employeeExists[0].id_admin !== req.user.id) {
      res.status(400);
      throw new Error("Usuário não autorizado!");
    }

    const deletedEmployee = await EmployeeModel.deleteEmployee(
      Number(req.params.id),
      req.user.id,
    );

    res.status(200);
    res.json({
      success: true,
      message: "Colaborador deletado com sucesso",
      data: {
        id: req.params.id,
        affectedRows: deletedEmployee.affectedRows,
      },
    });
  },
);
