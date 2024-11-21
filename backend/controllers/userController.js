const asyncHandler = require("express-async-handler");
const UserModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @description Register user
 * @route       POST /api/users/register
 * @access      Public
 */
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
    res.json({
      message: "Usuário criado",
      userId: result.insertId,
      token: generateToken(result.insertId)
    });
  } catch (error) {
    res.status(500);
    res.json({ message: "Erro ao criar usuário", error });
  }
});

/**
 * @description Login user
 * @route       POST /api/users/login
 * @access      Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Verifica os dados foram preenchidos
  if (!email || !password) {
    res.status(400);
    throw new Error("Por favor, preencha os campos.");
  }

  // Verifica se o usuário existe
  const userExists = await UserModel.getUser(email);

  if (userExists.length === 0) {
    res.status(400);
    throw new Error("Usuário não encontrado");
  }

  // Verifica se o usuário existe e se a senha é correta
  if (
    userExists.length > 0 &&
    (await bcrypt.compare(password, userExists[0].password))
  ) {
    res.json({ ...userExists[0], token: generateToken(userExists[0].id) });
  } else {
    res.status(400);
    throw new Error("Acessos incorretos");
  }
});

// const updateUser = asyncHandler(async (req, res) => {});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports = {
  registerUser,
  loginUser
};
