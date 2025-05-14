import { Types } from "mongoose";

export default interface IRate {
    _id?: Types.ObjectId;
    game: string;
    stars: number;
    comment: string;
    image: string;
}