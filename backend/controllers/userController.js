const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, state, city, phone } = req.body;

  if (!name || !email || !password || !state || !city || !phone) {
    res.status(400);
    throw new Error("Por favor, preencha todos os campos corretamente");
  }

  await res.json({ name, email, password, state, city, phone });
});

const loginUser = (req, res) => {
  res.send("Rota de login");
};

module.exports = {
  registerUser,
  loginUser
};
