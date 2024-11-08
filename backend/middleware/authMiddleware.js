const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await UserModel.getUserById(decoded.id);

      next();
    } catch (error) {
      throw new Error("Não autorizado");
    }
  } else {
    throw new Error("Sem autorização");
  }
});

module.exports = { protect };
