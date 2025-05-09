import mongoose, { mongo } from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Monngoose connected: ${conn.connection.host}`)
        
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1); // 1 means exit wuth failure, 0 means sucess
    }
}