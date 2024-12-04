const asyncHandler = require("express-async-handler");
const ClientModel = require("../model/ClientModel");

/**
 * @description Get all clients
 * @route       GET /api/clients
 * @access      Private
 */
const getClients = asyncHandler(async (req, res) => {
  const clients = await ClientModel.getClients(req.user.id);
  res.status(200).json(clients);
});

/**
 * @description Register client
 * @route       POST /api/clients
 * @access      Private
 */
const registerClient = asyncHandler(async (req, res) => {
  const { name, sex, phone, address, birth } = req.body;

  if (!name || !sex || !phone || !address || !birth) {
    res.status(400);
    throw new Error("Por favor, preencha os campos!");
  }

  const { userId } = await ClientModel.createClient(
    name,
    sex,
    phone,
    address,
    birth,
    req.user.id
  );

  res.status(201);
  res.json({
    success: true,
    message: "Cliente cadastrado com sucesso!",
    data: {
      userId
    }
  });
});

/**
 * @description Update client
 * @route       PUT /api/clients/:id
 * @access      Private
 */
const updateClient = asyncHandler(async (req, res) => {
  const { name, sex, phone, address, birth } = req.body;

  if (!name || !sex || !phone || !address || !birth) {
    res.status(400);
    throw new Error("Por favor, preencha todos os campos!");
  }

  const clientExists = await ClientModel.getClientById(req.params.id);

  if (clientExists.length === 0) {
    res.status(400);
    throw new Error("Cliente não encontrado!");
  }

  if (!req.user) {
    res.status(400);
    throw new Error("Usuário não encontrado!");
  }

  if (clientExists[0].id_admin !== req.user.id) {
    res.status(400);
    throw new Error("Usuário não autorizado!");
  }

  const affectedRows = await ClientModel.updateClient(
    name,
    sex,
    phone,
    address,
    birth,
    req.params.id
  );

  res.status(200);
  res.json({
    success: true,
    message: "Cliente atualizado com sucesso!",
    data: {
      affectedRows
    }
  });
});

/**
 * @description Delete client
 * @route       DELETE /api/clients/:id
 * @access      Private
 */
const deleteClient = asyncHandler(async (req, res) => {
  const clientExists = await ClientModel.getClientById(req.params.id);

  if (clientExists.length === 0) {
    res.status(400);
    throw new Error("Cliente não encontrado!");
  }

  if (!req.user) {
    res.status(400);
    throw new Error("Usuário não encontrado!");
  }

  if (clientExists[0].id_admin !== req.user.id) {
    res.status(400);
    throw new Error("Usuário não autorizado!");
  }

  const deletedClient = await ClientModel.deleteClient(req.params.id);

  res.status(200);
  res.json(deletedClient);
});

module.exports = {
  getClients,
  registerClient,
  updateClient,
  deleteClient
};
