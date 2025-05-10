const asyncHandler = require("express-async-handler");
const ServiceModel = require("./service.model");
const redisClient = require("../../config/redisClient");

/**
 * @description Get services
 * @route       GET /api/services
 * @access      Private
 */
const getServices = asyncHandler(async (req, res) => {
  const result = await ServiceModel.getServices(req.user.id);
  await redisClient.set(req.cacheKey, JSON.stringify(result), { EX: 300 });

  res.status(200).json(result);
});

/**
 * @description Set services
 * @route       POST /api/services
 * @access      Private
 */
const setService = asyncHandler(async (req, res) => {
  const { name, value, idAdmin } = req.body;

  // Verifica se os campos foram preenchidos
  if (!name || !value || !idAdmin) {
    res.status(400);
    throw new Error("Por favor, preencha os campos corretamente");
  }

  // Verifica se o serviço já existe
  const serviceExists = await ServiceModel.getServiceByName(name);

  if (serviceExists.length > 0) {
    res.status(400);
    throw new Error("Serviço já existe");
  }

  // Faz o cadastro no Banco de Dados
  const result = await ServiceModel.createService(name, value, idAdmin);
  res.status(201).json({
    message: "Serviço criado",
    id: result.insertId
  });
});

/**
 * @description Update services
 * @route       PUT /api/services/:id
 * @access      Private
 */
const updateService = asyncHandler(async (req, res) => {
  const service = await ServiceModel.getServiceById(req.params.id);

  if (service.length === 0) {
    res.status(400);
    throw new Error("Serviço não encontrado");
  }

  if (!req.user) {
    res.status(400);
    throw new Error("Usuário não encontrado");
  }

  if (service[0].id_admin !== req.user.id) {
    res.status(400);
    throw new Error("Usuário não autorizado");
  }

  const result = await ServiceModel.updateService(
    req.body.name,
    req.body.value,
    req.params.id,
    req.user.id
  );
  res.status(200);
  res.json({
    success: true,
    message: "Serviço atualizado com sucesso!",
    data: {
      affectedRows: result.affectedRows
    }
  });
});

/**
 * @description Delete services
 * @route       DELETE /api/services/:id
 * @access      Private
 */
const deleteService = asyncHandler(async (req, res) => {
  const service = await ServiceModel.getServiceById(req.params.id);

  if (service.length === 0) {
    res.status(400);
    throw new Error("Serviço não encontrado");
  }

  if (!req.user) {
    res.status(400);
    throw new Error("Usuário não encontrado");
  }

  if (service[0].id_admin !== req.user.id) {
    res.status(401);
    throw new Error("Usuário não autorizado");
  }

  await ServiceModel.deleteService(req.params.id, req.user.id);
  res.status(200).json({
    success: true,
    message: "Serviço deletado com sucesso",
    data: {
      id: req.params.id
    }
  });
});

module.exports = {
  getServices,
  setService,
  updateService,
  deleteService
};
