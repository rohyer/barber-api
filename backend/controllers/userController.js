const asyncHandler = require("express-async-handler");
const UserModel = require("../model/userModel");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, password2, city, state, phone } = req.body;

  // Verifica se os campos foram preenchidos
  if (!name || !email || !password || !password2 || !state || !city || !phone) {
    res.status(400);
    throw new Error("Por favor, preencha todos os campos corretamente");
  }

  // Verifica se o usuário existe
  const userExists = await UserModel.getUser(email);

  if (userExists.length > 0) {
    res.status(500);
    throw new Error("Usuário já existente");
  }

  // Verifica se as senhas batem e criptografa elas
  if (password !== password2) {
    res.status(400);
    throw new Error("Confirme sua senha digitando-a igualmente");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(password, salt);

  // Faz o cadastro do usuário
  try {
    const result = await UserModel.addUser(
      name,
      email,
      passwordHashed,
      city,
      state,
      phone
    );
    res.status(201);
    res.json({ message: "Usuário criado", userId: result.insertId });
  } catch (error) {
    res.status(500);
    res.json({ message: "Erro ao criar usuário", error });
  }
});

module.exports = {
  registerUser
};
