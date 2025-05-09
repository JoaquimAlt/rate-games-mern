import Rate from "../models/rate.model.js";
import mongoose from "mongoose";

export const getAllRates = async (req, res) => {
    try {
        const rates = await Rate.find();
        res.status(200).json({sucess: true, data: rates});
    } catch (error) {
        console.log("Erro ao buscar as avaliações", error.message);
        res.status(500).json({sucess: false, msg: "Server error!"});
    }
};

export const  createRate= async (req, res) => {
    const rate = req.body;

    if(!rate.game || !rate.stars || !rate.comment){
        return res.status(400).json({sucess: false, msg: "Preencha todos os campos para prosseguir!"});
    };

    const newRate = new Rate(rate);

    try {
        await newRate.save();
        res.status(201).json({sucess: true, data: newRate});
    } catch (error) {
        console.error("Erro ao criar avalição!");
        res.status(500).json({sucess: false, msg: "Server error!"});
    }
};

export const updateRate = async (req, res) => {
    const {id} = req.params;

    const rate = req.body; 

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({sucess: false, msg: "Id de avalição inválido"})
    }

    try {
        const updateRate = await Rate.findByIdAndUpdate(id, rate,{new: true});
        res.status(200).json({sucess: true, data: updateRate});

    } catch (error) {
        res.status(500).json({sucess: false, msg: "Server Error"})
    }

};

export const deleteRate = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({sucess: false, msg: "Id de avalição inválido"})
    }

    try {
        await Rate.findByIdAndDelete(id);
        res.status(200).json({sucess: true, msg: "Avaliação deletada com sucesso!"})

    } catch (error) {
        res.status(500).json({sucess: false, msg: "Server Error"})
    }
};