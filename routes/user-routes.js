import express from "express";
import passport from "passport";
import authControllers from "../controller/user-controller.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] }),
// );
// router.get(
//   "/auth/google/authenticationsystem",
//   passport.authenticate("google", {
//     failureRedirect: `${process.env.CLIENT_URL}/login`,
//   }),
//   (req, res) => {
//     req.session.save(() => {
//       res.redirect(`${process.env.CLIENT_URL}/`);
//     });
//   },
// );

// router.get(
//   "/auth/github",
//   passport.authenticate("github", { scope: ["user:email"] }),
// );
// router.get(
//   "/auth/github/callback",
//   passport.authenticate("github", {
//     failureRedirect: `${process.env.CLIENT_URL}/login`,
//   }),
//   (req, res) => {
//     req.session.save(() => {
//       res.redirect(`${process.env.CLIENT_URL}/`);
//     });
//   },
// );
router.post("/register", authControllers.Registration);
router.post("/login", authControllers.Login);
router.get(
  "/tokenverifier",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ authenticated: true });
  },
);
export default router;
