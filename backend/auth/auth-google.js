const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // seu model do MongoDB
const { generateToken } = require('../controllers/user.controller');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5555/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const photo = profile.photos?.[0]?.value || null;

        // Procura usuário no MongoDB
        let user = await User.findOne({ email });

        if (!user) {
            // Se não existir, cria já com a foto
            user = await User.create({
                email,
                username: profile.displayName,
                profileImage: photo
            });
        } else if (!user.profileImage && photo) {
            // Se já existe mas não tem foto, atualiza
            user.profileImage = photo;
            await user.save();
        }

        // Gera JWT com dados do usuário
        const token = generateToken(user);

        return done(null, { token });
    } catch (error) {
        return done(error, null);
    }
}));
