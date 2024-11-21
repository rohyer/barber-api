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

  const result = await ClientModel.createClient(
    name,
    sex,
    phone,
    address,
    birth,
    req.user.id
  );

  res.status(201);
  res.json({
    message: "Cliente cadastrado com sucesso!",
    id: result.insertId
  });
});

module.exports = { getClients, registerClient };
