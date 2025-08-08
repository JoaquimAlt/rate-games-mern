const mongoose = require("mongoose");
const { type } = require("os");

const rateSchema = new mongoose.Schema({
    gameId:{
        type: String,
        required: true
    },
    game:{
        type: String,
        required: true
    },
    stars:{
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
    {timestamps: true} // createdAt, updatedAt
);

const Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;