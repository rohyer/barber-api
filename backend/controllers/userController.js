const asyncHandler = require("express-async-handler");
const UserModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

/**
 * @description Update user data
 * @route       PUT /api/users/:id
 * @access      Private
 */
const updateUserData = asyncHandler(async (req, res) => {
  const userExists = await UserModel.getUserById(req.user.id);

  if (userExists.length === 0) {
    res.status(400);
    throw new Error("Usuário não encontrado!");
  }

  const { name, city, state, phone } = req.body;

  if (!name || !city || !state || !phone) {
    res.status(400);
    throw new Error("Por favor, preencha os campos!");
  }

  if (Number(req.params.id) !== req.user.id) {
    res.status(400);
    throw new Error("Usuário não autorizado!");
  }

  const user = await UserModel.updateUserData(
    name,
    city,
    state,
    phone,
    req.params.id
  );

  res.status(200);
  res.json({
    user
  });
});

/**
 * @description Update user password
 * @route       PUT /api/users/password/:id
 * @access      Private
 */
const updateUserPassword = asyncHandler(async (req, res) => {
  const userExists = await UserModel.getUserById(req.params.id);

  if (userExists.length === 0) {
    res.status(400);
    throw new Error("Usuário não encontrado!");
  }

  if (Number(req.params.id) !== req.user.id) {
    res.status(400);
    throw new Error("Usuário não autorizado!");
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Por favor, preencha os campos!");
  }

  if (
    userExists.length > 0 &&
    (await bcrypt.compare(currentPassword, userExists[0].password))
  ) {
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(newPassword, salt);

    const updatedPassword = await UserModel.updateUserPassword(
      passwordHashed,
      req.params.id
    );

    res.status(200);
    res.json({
      message: "Senha Atualizada com sucesso!",
      ...updatedPassword
    });
  } else {
    res.status(400);
    throw new Error("Senha atual incorreta!");
  }
});

/**
 * @description Update user e-mail
 * @route       PUT /api/users/email/:id
 * @access      Private
 */
const updateUserEmail = asyncHandler(async (req, res) => {
  const { newEmail, password } = req.body;

  if (!newEmail || !password) {
    res.status(400);
    throw new Error("Por favor, preencha os campos!");
  }

  if (Number(req.params.id) !== req.user.id) {
    res.status(400);
    throw new Error("Usuário não autorizado!");
  }

  const userExists = await UserModel.getUserById(req.params.id);

  if (userExists.length === 0) {
    res.status(400);
    throw new Error("Usuário não encontrado!");
  }

  const isMatch = await bcrypt.compare(password, userExists[0].password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Senha incorreta!");
  }

  const emailExists = await UserModel.getUser(newEmail);

  if (emailExists.length > 0) {
    res.status(400);
    throw new Error("Novo e-mail já está em uso!");
  }

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpires = new Date(Date.now() + 3600 * 1000);

  try {
    // Save request at database
    await UserModel.saveEmailChangeRequest(
      newEmail,
      token,
      tokenExpires,
      req.params.id
    );

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_TRANSPORTER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Send e-mail
    const link = `http://localhost:5000/confirm-email-change?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_TRANSPORTER,
      to: newEmail,
      subject: "Confirmação de alteração de e-mail.",
      text: `Clique no link para confirmar a alteração de e-mail: ${link}`
    });

    res.status(200);
    res.json({ message: "E-mail de confirmação enviado com sucesso!" });
  } catch (error) {
    res.status(400);
    throw new Error("Erro ao solicitar alteração de e-mail!");
  }
});

/**
 * @description Send e-mail to confirm user e-mail change
 * @route       GET /confirm-email-change
 * @access      Public
 */
const confirmEmailChange = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    res.status(400);
    throw new Error("Por favor, insira o token!");
  }

  const user = await UserModel.getUserByEmailToken(token);

  if (!user) {
    res.status(400);
    throw new Error("Token inválido ou expirado!");
  }

  if (user.email_token_expires < new Date()) {
    res.status(400);
    throw new Error("Token expirado!");
  }

  try {
    await UserModel.updateUserEmail(user.new_email, user.id);

    res.status(200);
    res.json({ message: "E-mail atualizado com sucesso!" });
  } catch (error) {
    res.status(400);
    throw new Error("Erro ao atualizar e-mail!");
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports = {
  registerUser,
  loginUser,
  updateUserData,
  updateUserPassword,
  updateUserEmail,
  confirmEmailChange
};
