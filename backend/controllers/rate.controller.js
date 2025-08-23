const Rate = require("../models/rate.model.js");
const mongoose = require("mongoose");
const axios = require("axios");

exports.getAllRates = async (req, res) => {
    try {
        const rates = await Rate.find().populate("user", "username profileImage").sort({createdAt: -1});
        res.status(200).json({success: true, data: rates});
    } catch (error) {
        console.log("Erro ao buscar as avaliações", error.message);
        res.status(500).json({success: false, msg: "Server error!"});
    }
};

exports.createRate = async (req, res) => {
    const rate = req.body;

    if(!rate.game || !rate.stars || !rate.comment){
        return res.status(400).json({success: false, msg: "Preencha todos os campos para prosseguir!"});
    };

    const userId = rate.user;
    if(!userId){
        return res.status(401).json({success: false, msg: "Usuário não autorizado!"});
    }

    const rateAlreadyExist = await Rate.findOne({user: userId, gameId: rate.gameId});

    if (rateAlreadyExist) {
        return res.status(401).json({success: false, msg: "Você já fez uma avaliação desse jogo"});
    }

    const newRate = new Rate({
        game: rate.game,
        stars: rate.stars,
        comment: rate.comment,
        image: rate.image,
        user: userId,
        gameId: rate.gameId
    });

    try {
        await newRate.save();
        res.status(201).json({success: true, msg: "Avaliação registrada com sucesso!", data: newRate});
    } catch (error) {
        console.error("Erro ao criar avalição!");
        res.status(500).json({success: false, msg: "Server error!"});
    }
};

exports.updateRate = async (req, res) => {
    const {id} = req.params;

    const userId = req.user._id;
    if(!userId){    
        return res.status(401).json({success: false, msg: "Usuário não autorizado!"});
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, msg: "Id de avalição inválido"})
    }

    const rate = await Rate.findById(id);
    if(!rate){
        return res.status(404).json({success: false, msg: "Avaliação não encontrada!"});
    }

    if(rate.user.toString() !== userId.toString()){
        return res.status(401).json({success: false, msg: "Voê não tem permissão para editar essa avaliação!"});
    }

    try {
        const rate = req.body;
        const updateRate = await Rate.findByIdAndUpdate(id, rate,{new: true}).populate("user", "username");
        res.status(200).json({success: true, data: updateRate});

    } catch (error) {
        res.status(500).json({success: false, msg: "Server Error"})
    }

};

exports.deleteRate = async (req, res) => {
    const {id} = req.params;
    const userId = req.user._id;
    if(!userId){    
        return res.status(401).json({success: false, msg: "Usuário não autorizado!"});
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, msg: "Id de avalição inválido"})
    }

    const rate = await Rate.findById(id);
    if(!rate){
        return res.status(404).json({success: false, msg: "Avaliação não encontrada!"});
    }

    if(rate.user.toString() !== userId.toString()){
        return res.status(401).json({success: false, msg: "Voê não tem permissão para deletar essa avaliação!"});
    }

    try {
        await Rate.findByIdAndDelete(id);
        res.status(200).json({success: true, msg: "Avaliação deletada com successo!"})

    } catch (error) {
        res.status(500).json({success: false, msg: "Server Error"})
    }
};

exports.getMyRates = async (req, res) => {
    const userId = req.user._id;
    const order = req.query.order === "recentes" ? -1 : 1;

    if(!userId){
        return res.status(401).json({success: false, msg: "Usuário não autorizado!"});
    }

    try {
        const rates = await Rate.find({user: userId}).populate("user", "username profileImage").sort({updatedAt: order});
        res.status(200).json({success: true, data: rates});
    } catch (error) {
        console.log("Erro ao buscar as avaliações", error.message);
        res.status(500).json({success: false, msg: "Server error!"});
    }
}

exports.getRatesByGame = async (req, res) => {
    const {gameId} = req.query;
    
    try {
        const rates = await Rate.find({gameId}).populate("user", "username profileImage").sort({createdAt: -1});

        if (rates.length === 0) {
            return res.status(200).json({success: true, msg: "Nenhuma avaliação deste jogo no RateGames"});
        }

        res.status(200).json({success: true, data: rates});
        
    } catch (error) {
        console.log("Erro ao buscar as avaliações");
        res.status(500).json({success: false, msg: "Server error!"});
    }
};

exports.getGamesWithMoreRates = async (req, res) => {
    const {limit} = req.query;
    const limitNumber = parseInt(limit) || 4;

    try {
        const rates = await Rate.aggregate([
            {
                $group: {
                    _id: "$gameId",
                    game: { $first: "$game" },
                    count: { $sum: 1 },
                    image: { $first: "$image" },
                    stars: { $avg: "$stars" }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: limitNumber
            }
        ]);

        res.status(200).json({success: true, data: rates});
    } catch (error) {
        console.log("Erro ao buscar jogos com mais avaliações", error.message);
        res.status(500).json({success: false, msg: "Server error!"});
    }
}