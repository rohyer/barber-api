const asyncHandler = require("express-async-handler");
const CustomerServiceModel = require("../model/CustomerServiceModel");

/**
 * @description Get all customer services
 * @route       GET /api/customer-services
 * @access      Private
 */
const getCustomerServices = asyncHandler(async (req, res) => {
  const customerServices = await CustomerServiceModel.getCustomerServices(
    req.params.id
  );

  res.status(200).json(customerServices);
});

/**
 * @description Register customer service
 * @route       POST /api/customer-services
 * @access      Private
 */
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

/**
 * @description Update customer service
 * @route       PUT /api/customer-services/:id
 * @access      Private
 */
const updateCustomerService = asyncHandler(async (req, res) => {
  const { date, time, idService, idClient, idEmployee } = req.body;

  const customerServiceExists =
    await CustomerServiceModel.getCustomerServiceById(req.params.id);

  if (customerServiceExists.length === 0) {
    res.status(400);
    throw new Error("Atendimento não encontrado!");
  }

  if (!req.user) {
    res.status(400);
    throw new Error("Usuário não encontrado!");
  }

  if (customerServiceExists[0].id_admin !== req.user.id) {
    res.status(400);
    throw new Error("Usuário não autorizado!");
  }

  const updatedServiceCustomer =
    await CustomerServiceModel.updateCustomerService(
      date,
      time,
      idService,
      idClient,
      idEmployee,
      req.params.id
    );

  res.status(200);
  res.json(updatedServiceCustomer);
});

module.exports = {
  getCustomerServices,
  setCustomerService
};
