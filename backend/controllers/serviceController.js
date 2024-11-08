const asyncHandler = require("express-async-handler");
const ServiceModel = require("../model/serviceModel");

// Pega todos os serviços de determinado usuário
const getServices = asyncHandler(async (req, res) => {
  try {
    const result = await ServiceModel.getServices(req.user.id);
    res.status(200);
    res.json({ result });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// Cria um serviço
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
  try {
    const result = await ServiceModel.createService(name, value, idAdmin);
    res.status(201);
    res.json({
      message: "Serviço criado",
      id: result.insertId
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  getServices,
  setService
};
