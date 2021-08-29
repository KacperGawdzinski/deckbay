import express from "express";
const chessRouter = express.Router();

chessRouter.get("/", (req, res) => {
  //   //set random nick
  //   if (!req.signedCookies.username)
  //     res.cookie("username", faker.name.findName(), { signed: true });
  //   res.render("room_list.ejs", { game_type: "CHESS", user_login: req.login });
});

chessRouter.post("/", (req, res) => {
  if (!req.body.roomName)
    return res.status(401).send({ roomNameError: "Room name not found" });
  if (!req.body.side)
    return res.status(401).send({ sideError: "Side not found" });
  if (!req.body.length)
    return res.status(401).send({ lengthError: "Game length not found" });
  if (!req.body.bonus)
    return res.status(401).send({ bonusError: "Game bonus time not found" });

  req.app.get("chessRoomGameTab").push({
    roomName: req.body.roomName,
    players: [],
    password: req.body.password,
    //insert options
  });
  //trigger io send rooms
  return res.sendStatus(200);
});

chessRouter.get("/:id", (req, res) => {
  //   //if two players have the same nick may be problem - remove spaces
  //   if (req.body.game_type != "chess") {
  //     res.status(403);
  //     res.send("You don't have permission to enter this room!");
  //     return;
  //   }
  //   let fullRoomName = req.body.game_type + "-" + req.params.id;
  //   if (roomPasswd.get(fullRoomName)) {
  //     let temp = roomPlayers[fullRoomName];
  //     if (!temp.includes(req.signedCookies.login)) {
  //       res.status(403);
  //       res.send("You don't have permission to enter this room!");
  //       return;
  //     }
  //   }
  //   loginRoom.set(req.signedCookies.login, fullRoomName);
  //   res.render("game_chess_page", {
  //     room_name: req.params.id,
  //     game_type: req.body.game_type,
  //     user_login: req.signedCookies.login,
  //   });
});
export default chessRouter;
