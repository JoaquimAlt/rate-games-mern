import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import rateRoutes from "./routes/rate.route.js"
import authRoutes from "./routes/user.route.js"
import path from "path"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;

const __dirname = path.resolve();

app.use(express.json()); 

app.use("/api/rates", rateRoutes);

app.use("/api/users", authRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("/{*splat}", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
    connectDB();
    console.log(`App running at port: ${PORT}`)
})