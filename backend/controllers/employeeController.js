const asyncHandler = require("express-async-handler");
const EmployeeModel = require("../model/EmployeeModel");

/**
 * @description Get all employees
 * @route       GET /api/employees
 * @access      Private
 */
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await EmployeeModel.getEmployees(req.user.id);
  res.status(200).json({ employees });
});

/**
 * @description Register employee
 * @route       POST /api/employees
 * @access      Private
 */
const setEmployee = asyncHandler(async (req, res) => {
  const { name, address, sex, phone, birth } = req.body;

  if (!name || !address || !sex || !phone || !birth) {
    res.status(400);
    throw new Error("Por favor, preencha os campos");
  }

  const result = await EmployeeModel.setEmployee(
    name,
    address,
    sex,
    phone,
    birth,
    req.user.id
  );

  res.status(201);
  res.json({
    message: "Colaborador cadastrado com sucesso!",
    id: result.insertId
  });
});

/**
 * @description Update Employee
 * @route PUT /api/employees/:id
 * @access Private
 */
const updateEmployee = asyncHandler(async (req, res) => {
  const { name, address, sex, phone, birth } = req.body;

  if (!name || !address || !sex || !phone || !birth) {
    res.status(400);
    throw new Error("Por favor preencha os campos");
  }

  const employeeExists = await EmployeeModel.getEmployeeById(req.params.id);

  if (employeeExists.length === 0) {
    res.status(400);
    throw new Error("Colaborador não encontrado!");
  }

  if (!req.user) {
    res.status(400);
    throw new Error("Usuário não encontrado!");
  }

  if (employeeExists[0].id_admin !== req.user.id) {
    res.status(400);
    throw new Error("Usuário não autorizado!");
  }

  const updatedEmployee = await EmployeeModel.updateEmployee(
    name,
    address,
    sex,
    phone,
    birth
  );
  res.status(200);
  res.json(updatedEmployee);
});

module.exports = {
  getEmployees,
  setEmployee,
  updateEmployee
};
