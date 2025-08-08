const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const User = require('../models/user.model.js');

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ msg: "JWT_SECRET não configurado" });
    }
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ msg: "Usuário não encontrado" });
    }

    next();

  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Token inválido" });
  }
}

module.exports = authMiddleware;
