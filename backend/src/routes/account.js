import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { SALT_ROUNDS } from "../config.js";
// import Token =("../models/tokenModel");

const accountRouter = express.Router();

accountRouter.post("/login", async (req, res) => {
  if (!req.body.username)
    return res.status(401).json({ usernameError: "Username not found" });
  if (!req.body.username)
    return res.status(401).json({ passwordError: "Invalid password" });

  const user = await User.findOne({
    username: req.body.username,
  });

  if (!user)
    return res.status(401).json({ usernameError: "Username not found" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(401).send({ passwordError: "Invalid password" });

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
  if (!req.body.email)
    return res.status(401).send({ emailError: "Email not found" });
  if (!req.body.username)
    return res.status(401).send({ usernameError: "Username not found" });
  if (!req.body.password)
    return res.status(401).send({ passwordError: "Password not found" });

  const hashed = await bcrypt.hash(req.body.password, SALT_ROUNDS);
  try {
    await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashed,
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(401).send({ error: "User already exists" });
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
