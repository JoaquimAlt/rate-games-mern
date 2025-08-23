const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db.js");
const rateRoutes = require("./routes/rate.route.js");
const authRoutes = require("./routes/user.route.js");
const otpRoutes = require("./routes/otp.route.js");
const passport = require("passport");
require("./auth/auth-google");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware do Passport (não usa session)
app.use(passport.initialize());

// Rotas Google OAuth
app.get("/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback", 
    passport.authenticate("google", { session: false }),
    (req, res) => {
        const token = req.user.token;
        res.redirect(`${FRONTEND_URL}/auth/google/callback?token=${token}`); // Redireciona para o frontend com o token
    }
);

app.use("/api/rates", rateRoutes);
app.use("/api/users", authRoutes);
app.use("/api/otp", otpRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`App running at port: ${PORT}`);
});
