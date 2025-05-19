import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import rateRoutes from "./routes/rate.route.js";
import authRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;

// 🔐 CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://rate-games-mern-3o2zx1lvg-joaquimalts-projects.vercel.app"
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.use("/api/rates", rateRoutes);
app.use("/api/users", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`App running at port: ${PORT}`);
});
