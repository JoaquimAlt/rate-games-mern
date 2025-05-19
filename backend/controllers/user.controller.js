import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user) => {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}

export const registerUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Função para validar força da senha
    const isWeakPassword = (password) => {
        // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return !strongRegex.test(password);
    };

    // VALIDATION
    if (!username) {
        return res.status(422).json({ msg: "O nome é obrigatório" });
    }

    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório" });
    }

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória" });
    }

    if (password !== confirmPassword) {
        return res.status(422).json({ msg: "As senhas não batem" });
    }

    if (isWeakPassword(password)) {
        return res.status(422).json({
            msg: "A senha é fraca. Use ao menos 8 caracteres, com letra maiúscula, minúscula, número e símbolo.",
        });
    }

    // CHECK IF USER EXISTS
    const emailExists = await User.findOne({ email: email });
    const nameExists = await User.findOne({ username: username });

    if (emailExists) {
        return res.status(422).json({ msg: "O email já está em uso" });
    }

    if (nameExists) {
        return res.status(422).json({ msg: `O nome ${username} já está em uso` });
    }

    // CREATE PASSWORD HASH
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // CREATE USER
    const user = new User({
        username,
        email,
        password: passwordHash,
    });

    try {
        const savedUser = await user.save();
        const token = generateToken(savedUser);
        res.status(201).json({ msg: "Usuário criado", token: token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Aconteceu um erro no servidor" });
    }
};


export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    //VALIDATION
    if(!email){
        return res.status(422).json({msg: "O email é obrigatorio"})
    }
    if(!password){
        return res.status(422).json({msg: "A senha é obrigatoria"})
    }

    //CHECK IF USER EXISTS
    const user = await User.findOne({email: email})

    if(!user){
        return res.status(404).json({msg: "Usuario não encontrado"})
    }

    //CHECK USER PASSWORD
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(422).json({msg: "Senha inválida"})
    }

    try {

        const token = generateToken(user);
        res.status(200).json({msg: "Usuário autenticado com sucesso", token});

    } catch (error) {
        console.log(error)        
        res.status(500).json({msg: "Aconteceu um erro no servidor"})
    }
}

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Erro ao buscar o usuário:", error.message);
    res.status(500).json({ msg: "Erro ao buscar o usuário" });
  }
};
