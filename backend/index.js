const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db.js");
const rateRoutes = require("./routes/rate.route.js");
const authRoutes = require("./routes/user.route.js");
const otpRoutes = require("./routes/otp.route.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://rate-games-mern.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.use("/api/rates", rateRoutes);
app.use("/api/users", authRoutes);
app.use("/api/otp", otpRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`App running at port: ${PORT}`);
});
