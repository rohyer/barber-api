const registerUser = (req, res) => {
  const { name, email, password, state, city, phone } = req.body;

  if (!name || !email || !password || !state || !city || !phone) {
    res.status(400);
    throw new Error("Por favor, preencha todos os campos corretamente");
  }

  res.json({ name, email, password, state, city, phone });
};

const loginUser = (req, res) => {
  res.send("Rota de login");
};

module.exports = {
  registerUser,
  loginUser
};
