import pool from "../config/databaseconnection.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function Registration(req, res, next) {
  const { name, email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM public.user where email=$1",
      [email],
    );
    if (result.rows.length === 0) {
      const newUser = { name: name, email: email, password: password };
      await pool.query(
        "INSERT INTO public.user(name,email,password) values($1,$2,$3) RETURNING *",
        [name, email, password],
      );
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );
      res.json({
        name: newUser.name,
        email: newUser.email,
        registered: true,
        message: "The user is successfully registered.",
        token,
      });
    } else {
      res.json({
        registered: false,
        message: "The user is already exist try to login.",
      });
    }
  } catch (err) {
    return next(err);
  }
}

function Login(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.json({ authenticated: false, message: info.message });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    return res.json({
      name: user.name,
      email: user.email,
      authenticated: true,
      message: info.message,
      token,
    });
  })(req, res, next); //this type of function is used when you want to check the authentication using passport strategy and also send the response based on the authentication
}

export default { Registration, Login };
