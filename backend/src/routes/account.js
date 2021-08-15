import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
// import Token =("../models/tokenModel");

const accountRouter = express.Router();
const saltRounds = 10;

accountRouter.post("/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
  });

  if (!user) return res.status(401).json({ userError: "Username not found" });

  //const validPassword = await bcrypt.compare(req.body.password, user.password);
  //   if (!validPassword) {
  //     res.status(401).json({ error: "Invalid password" });
  //     return;
  //   }
  //   const accessToken = jwt.sign(
  //     req.body.username,
  //     process.env.JWT_ACCESS_TOKEN,
  //     {
  //       expiresIn: "15s",
  //     }
  //   );
  //   const refreshToken = jwt.sign(userObject, process.env.JWT_REFRESH_TOKEN);

  //   await Token.create({
  //     value: refreshToken,
  //   });

  //   res.cookie("jwtAccess", accessToken, {
  //     //httpOnly: true,
  //   });
  //   res.cookie("jwtRefresh", refreshToken, {
  //     //path: '/refresh',
  //   });
  res.status(200).send("OK");
});

accountRouter.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, saltRounds);
  try {
    await User.create({
      email: req.body.email,
      login: req.body.login,
      password: hashed,
    });
  } catch (err) {
    if (err.code === 11000) {
      res.send(401).json({ error: "User already exists" });
      return;
    }
  }
  res.sendStatus(200);
});

accountRouter.post("/logout", (req, res) => {
  try {
    Token.findOneAndRemove({
      value: req.cookies["jwtRefresh"],
    });
    res.cookie("jwtAccess", 0, {
      maxAge: -1,
    });
    res.cookie("jwtRefresh", 0, {
      maxAge: -1,
    });
    res.sendStatus(200);
  } catch (err) {
    res.send(500);
  }
});

export default accountRouter;
