import express from "express";
const chessRouter = express.Router();

chessRouter.get("/", (req, res) => {
  req.app.get("io").on("connection", (client: any) => {
    console.log("Client connected");

    client.on("chess ev", (data: any) => {
      console.log("UDALO SIE");
    });
    client.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
  //   //set random nick
  //   if (!req.signedCookies.username)
  //     res.cookie("username", faker.name.findName(), { signed: true });
  //   res.render("room_list.ejs", { game_type: "CHESS", user_login: req.login });
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
