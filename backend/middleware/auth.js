import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import User from '../models/user.model.js';

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado" });
  }

  try {

    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select("-password")
    next();

  } catch (error) {

    console.log(error);
    res.status(400).json({ msg: "Token inválido" });

  }
}

export default authMiddleware;
