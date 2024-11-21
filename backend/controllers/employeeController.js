const asyncHandler = require("express-async-handler");
const EmployeeModel = require("../model/EmployeeModel");

const getEmployees = asyncHandler(async (req, res) => {
  const employees = await EmployeeModel.getEmployees(req.user.id);
  res.status(200).json({ employees });
});

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

module.exports = {
  getEmployees,
  setEmployee
};
