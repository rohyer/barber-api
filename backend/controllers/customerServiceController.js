const asyncHandler = require("express-async-handler");
const CustomerServiceModel = require("../model/CustomerServiceModel");

const getCustomerServices = asyncHandler(async (req, res) => {
  const customerServices = await CustomerServiceModel.getCustomerServices(
    req.params.id
  );

  res.status(200).json(customerServices);
});

const setCustomerService = asyncHandler(async (req, res) => {
  const { date, time, idService, idClient, idEmployee } = req.body;

  if (!date || !time || !idService || !idClient || !idEmployee) {
    res.status(400);
    throw new Error("Por favor, preencha os campos");
  }

  const result = await CustomerServiceModel.createCustomerService(
    date,
    time,
    idService,
    idClient,
    idEmployee,
    req.user.id
  );

  res.status(201);
  res.json({
    message: "Cadastro realizado com sucesso!",
    id: result.insertId
  });
});

module.exports = {
  getCustomerServices,
  setCustomerService
};
