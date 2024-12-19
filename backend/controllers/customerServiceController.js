const asyncHandler = require("express-async-handler");
const CustomerServiceModel = require("../model/CustomerServiceModel");
const redisClient = require("../config/redisClient");

/**
 * @description Get all customer services
 * @route       GET /api/customer-services
 * @access      Private
 */
const getCustomerServices = asyncHandler(async (req, res) => {
  const customerServices = await CustomerServiceModel.getCustomerServices(
    req.user.id
  );

  await redisClient.set(req.cacheKey, JSON.stringify(customerServices), {
    EX: 120
  });

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
    success: true,
    message: "Agendamento cadastrado com sucesso!",
    data: {
      id: result.insertId
    }
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

  const result = await CustomerServiceModel.updateCustomerService(
    date,
    time,
    idService,
    idClient,
    idEmployee,
    req.params.id,
    req.user.id
  );

  res.status(200);
  res.json({
    success: true,
    message: "Agendamento atualizado com sucesso!",
    data: {
      affectedRows: result.affectedRows
    }
  });
});

/**
 * @description Delete customer service
 * @route       DELETE /api/customer-services/:id
 * @access      Private
 */
const deleteCustomerService = asyncHandler(async (req, res) => {
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

  const deletedCustomerService =
    await CustomerServiceModel.deleteCustomerService(
      req.params.id,
      req.user.id
    );

  res.status(200);
  res.json({
    success: true,
    message: "Agendamento deletado com sucesso",
    data: {
      id: req.params.id
    }
  });
});

module.exports = {
  getCustomerServices,
  setCustomerService,
  updateCustomerService,
  deleteCustomerService
};
