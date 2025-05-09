import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import rateRoutes from "./routes/rate.route.js"

dotenv.config();

const app = express();

app.use(express.json()); // allow receive JSON in the req.body

app.use("/api/rates", rateRoutes);

const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
    connectDB();
    console.log(`App running at port: ${PORT}`)
})