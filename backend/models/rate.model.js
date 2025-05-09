import mongoose from "mongoose";

const rateSchema = new mongoose.Schema({
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
    }
},
    {timestamps: true} // createdAt, updatedAt
);

const Rate = mongoose.model('Rate', rateSchema);

export default Rate;