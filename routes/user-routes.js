import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import authControllers from "../controller/user-controller.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
router.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  }),
);
router.get(
  "/auth/google/authenticationsystem",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/`,
  }),
  (req, res) => {
    const token = jwt.sign({ email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    res.redirect(`${process.env.CLIENT_URL}/profile/` + token);
  },
);

router.get(
  "/auth/github",
  passport.authenticate("github", { session: false, scope: ["user:email"] }),
);
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/`,
  }),
  (req, res) => {
    const token = jwt.sign({ email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    res.redirect(`${process.env.CLIENT_URL}/profile/` + token);
  },
);
router.post("/register", authControllers.Registration);
router.post("/login", authControllers.Login);

router.get(
  "/profilefetcher",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      name: req.user.name,
      email: req.user.email,
      message: "Successfully authenticated",
      authenticated: true,
    });
  },
);

router.get(
  "/getToken",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const token = jwt.sign({ email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
    });
  },
);
export default router;
