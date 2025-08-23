const Otps = require("../models/otp.model");
const randomstring = require("randomstring");
const sendEmail = require("../utils/sendMail.util");
const User = require("../models/user.model");

function generateOTP() {
    return randomstring.generate({
        length: 4,
        charset: 'numeric'
    });
}

//CONTROLLER OTP, ENVIAR OTP PARA O EMAIL
exports.sendOTP = async (req, res, next) => {
    try {
        const { email } = req.query;

        const emailExists = await User.findOne({ email });

        if (!emailExists) {
            return res.status(404).json({ success: false, msg: "Email não registrado" });
        }

        const otpExists = await Otps.findOne({ email });

        if (otpExists) {
            return res.status(429).json({
                success: false,
                msg: "Já existe um código enviado. Aguarde alguns minutos para solicitar outro."
            });
        }

        const otp = generateOTP();
        const newOTP = new Otps({ email, otp });
        await newOTP.save();

        await sendEmail({
            to: email,
            subject: "Codigo de recuperação",
            message: `<section style="font-family: Arial, sans-serif;">
        <h1 style="color: #cc060d">RateGames</h1>
        <h2 style="font-size: 32px">${otp}</h2>
        <h3>Seu código de recuperação</h3>
        <p>Digite esse código de recuperação para mudar sua senha seu descuidado!</p>
    </section>`,
        });

        res.status(200).json({
            success: true,
            msg: "Codigo de verificação enviado com sucesso"
        });

    } catch (error) {
        console.error('Erro ao enviar OTP:', error);
        res.status(500).json({ success: false, msg: "Internal server error" })
    }
};

exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.query;
        const existingOTP = await Otps.findOneAndDelete({ email, otp });

        if (existingOTP) {
            //OTP é valido
            res.status(200).json({
                success: true,
                msg: "Codigo de verificação válido!"
            });
        } else {
            //OTP não é valido
            res.status(400).json({ success: false, msg: "Codigo de verificação inválido!" });
        }


    } catch (error) {
        console.error('Erro ao verificar OTP:', error);
        res.status(500).json({ success: false, msg: "Internal server error" })
    }
}