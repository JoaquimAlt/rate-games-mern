export default interface IRate {
    _id?: string;
    game: string;
    stars: number;
    comment: string;
    image: string;
    user?: string;
    gameId: string;
    createdAt?: string;
}