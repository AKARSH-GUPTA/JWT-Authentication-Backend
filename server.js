import express from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import GitHubStrategy from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import cors from "cors";
import userRoutes from "./routes/user-routes.js";
import strategies from "./config/Strategies.js";
import dotenv from "dotenv";
dotenv.config(); // Loads variables from .env into process.env
const app = express();

//ERROR handling middileware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Use environment variables for configuration
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL;

// app.set("trust proxy", 1); //for the render (secure cookies won't work without it)

//setting cors for cross site cookies handling

app.use(
  cors({
    origin: CLIENT_URL, // your React app URL
    credentials: true,
  }),
);

app.use(express.json()); //important fro recieving the json data through the axios requests
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

//strategies for the passport
passport.use(
  new Strategy(
    { usernameField: "email", passwordField: "password" },
    strategies.Local,
  ),
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    strategies.Google,
  ),
);

passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    strategies.Github,
  ),
);

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    strategies.Jwt,
  ),
);
//Routes
app.use("/", userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
