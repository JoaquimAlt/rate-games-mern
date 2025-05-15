import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user) => {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}

export const registerUser = async (req, res) => {

    const {username, email, password, confirmPassword} = req.body

    //VALIDATION
    if(!username){
        return res.status(422).json({msg: "O nome é obrigatorio"})
    }

    if(!email){
        return res.status(422).json({msg: "O email é obrigatorio"})
    }

    if(!password){
        return res.status(422).json({msg: "A senha é obrigatoria"})
    }

    if(password !== confirmPassword){
        return res.status(422).json({msg: "As senhas não batem"})
    }

    //CHECL IF USER EXISTS
    const userExists = await User.findOne({email: email})

    if (userExists) {
        return res.status(422).json({msg: "O email já está em uso"})
    }

    //CREATE PASSWORD
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //CREATE USER
    const user = new User({
        username,
        email,
        password: passwordHash,
    })

    try {

        const saveUser = await user.save();
        const token = generateToken(saveUser);
        res.status(201).json({msg: "Usuario criado", token: token});

    } catch(error) {
        console.log(error)        
        res.status(500).json({msg: "Aconteceu um erro no servidor"})
    }
}

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