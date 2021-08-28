import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { SALT_ROUNDS } from "../config";
import dotenv from "dotenv";
import { ChessRoomGame } from "../dataTypes/chessTypes";

dotenv.config({ path: "./config.env" });

const validationRouter = express.Router();

validationRouter.post("/login", async (req, res) => {
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

  const userObject = {
    username: req.body.username,
  };

  const accessToken = jwt.sign(
    userObject,
    process.env.JWT_ACCESS_TOKEN as string,
    {
      expiresIn: "15s",
    }
  );
  const refreshToken = jwt.sign(
    userObject,
    process.env.JWT_REFRESH_TOKEN as string
  );

  res.cookie("jwtAccess", accessToken, {
    expires: new Date(Date.now() + 9999999),
  });
  res.cookie("jwtRefresh", refreshToken, {
    //path: '/refresh',
  });
  res.sendStatus(200);
});

validationRouter.post("/register", async (req, res) => {
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
  } catch (err: any) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      if (field == "username")
        return res
          .status(401)
          .send({ usernameError: "Username already exists" });
      else if (field == "email")
        return res.status(401).send({ emailError: "Email already exists" });
    }
  }
  return res.sendStatus(200);
});

validationRouter.post("/room-password", async (req, res) => {
  if (!req.body.roomName)
    return res.status(401).send({ roomNameError: "Room name not found" });
  if (!req.body.game)
    return res.status(401).send({ gameError: "Game not found" });
  if (!req.body.password)
    return res.status(401).send({ passwordError: "Password not found" });

  for (const room of req.app.get("chessRooms")) {
    if (room.roomName === req.body.roomName) {
      if (room.password === req.body.password) {
        return res.status(200).send({ passwordError: "Invalid password" });
      } else {
        return res.status(401).send({ passwordError: "Invalid password" });
      }
    }
  }
  return res.status(400).send({ roomNameError: "Invalid room" });
});

// accountRouter.post("/logout", (req, res) => {
//   try {
//     Token.findOneAndRemove({
//       value: req.cookies["jwtRefresh"],
//     });
//     res.cookie("jwtAccess", 0, {
//       maxAge: -1,
//     });
//     res.cookie("jwtRefresh", 0, {
//       maxAge: -1,
//     });
//     res.sendStatus(200);
//   } catch (err) {
//     res.send(500);
//   }
// });

export default validationRouter;
