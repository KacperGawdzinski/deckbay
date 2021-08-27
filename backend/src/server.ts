// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import faker from "faker";

// import Checkers = require("./server-javascript/checkers-server");
// import { chessGame } = require("./server-javascript/chess-game-server");
// import charades = require("./routes/charades");
// import checkers = require("./routes/checkers");

import { Server } from "socket.io";
import { createServer } from "http";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import accountRouter from "./routes/account";
import chessRouter from "./routes/chess";
import { MONGO_CONNECTION_OPTIONS, MONGO_CONNECTION_STRING } from "./config";
import cors from "cors";
import { func } from "./routes/chesss";
import { ChessRoomInfo } from "./dataTypes/chessTypes";

const chessGames: ChessRoomInfo[] = [
  {
    password: true,
    roomName: "MMMMMMMMMM",
    gameLength: 10,
    bonusTime: 10,
    players: 1,
    observators: 3,
    hasStarted: false,
  },
  {
    password: false,
    roomName: "unlocked",
    gameLength: 1,
    bonusTime: 1,
    players: 2,
    observators: 0,
    hasStarted: true,
  },
  {
    password: true,
    roomName: "locked",
    gameLength: 10,
    bonusTime: 10,
    players: 1,
    observators: 0,
    hasStarted: false,
  },
  {
    password: false,
    roomName: "unlocked",
    gameLength: 1,
    bonusTime: 1,
    players: 2,
    observators: 3,
    hasStarted: true,
  },
];

var app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);
app.set("chessGames", chessGames);

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("joinChessRoomList", (data: any) => {
    socket.join("chessRoomList");
    io.to("chessRoomList").emit("getChessRoomList", chessGames);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

dotenv.config({ path: "./config.env" });
app.use(
  express.urlencoded({
    extended: true,
  })
);
const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
app.use("/chess", chessRouter);
app.use(accountRouter);

app.use("/", (req, res) => {
  res.send("OK");
});

const connectWithRetry = () => {
  mongoose
    .connect(MONGO_CONNECTION_STRING, MONGO_CONNECTION_OPTIONS)
    .then(() => {
      console.log("MongoDB is connected");
    })
    .catch((err) => {
      console.log("MongoDB connection unsuccessful, retry after 5 seconds.");
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

server.listen(process.env.PORT || 5000, () => {
  console.log("Server turned on");
});

// //CLEAN IN THE FUTURE
// var socketLogin = new Map(); //socket.id -> login
// var loginRoom = new Map(); //player login -> full room name
// var roomPasswd = new Map(); //full room name -> hashed password
// var roomOptions = new Map(); //full room name -> options
// var roomPlayers = {}; //full room name -> [players allowed to play (logins)]  //merge maps into one
// var roomBoard = {}; //full room name -> gameboard
// var roomTurn = new Map(); //full room name -> turn
// var roomLastMove = {};
// let roomChesslogic = new Map(); //full room name -> it's game in class representation

// app.locals.roomOptions = roomOptions;
// app.locals.loginRoom = loginRoom;
// app.locals.roomPasswd = roomPasswd;
// app.locals.roomPlayers = roomPlayers;
// app.locals.roomBoard = roomBoard;
// app.locals.roomTurn = roomTurn;
// app.locals.roomLastMove = roomLastMove;
// app.locals.roomChesslogic = roomChesslogic;

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

// app.post("/validate-room", async function (req, res) {
//   //maybe some default parameters? + change for other games
//   let ar = availableRooms(req.body.game);
//   let fullRoomName = (req.body.game + "-" + req.body.room).toLowerCase();
//   for (let i = 0; i < ar.length; i++) {
//     if (ar[i][fullRoomName] === fullRoomName) {
//       res.send("Room already exists!");
//       return;
//     }
//   }

//   if (req.body.room.length > 15) {
//     res.send("Room name is too long!");
//     return;
//   }

//   if (req.body.room === "") {
//     res.send("Insert room name!");
//     return;
//   }

//   /*if(!req.body.side) {
//         res.send('Choose side!'); return
//     }

//     if(!req.body.length) {
//         res.send('Choose game length!'); return
//     }

//     if(req.body.length > 30 || req.body.length < 1) {
//         res.send('Game length should be between 1-30min!'); return
//     }

//     if(!req.body.bonus) {
//         res.send('Choose bonus time length!'); return
//     }

//     if(req.body.bonus > 30 || req.body.bonus < 1) {
//         res.send('Bonus time should be between 1-30s!'); return
//     }*/

//   if (req.body.password) {
//     const hashed = await bcrypt.hash(req.body.password, saltRounds);
//     roomPasswd.set(fullRoomName, hashed);
//     roomPlayers[fullRoomName] = [req.signedCookies.login];
//   }

//   roomOptions.set(fullRoomName, {
//     side: req.body.side,
//     white: req.body.white,
//     black: req.body.black,
//     readyWhite: req.body.readyWhite,
//     readyBlack: req.body.readyBlack,
//     drawWhite: req.body.drawWhite,
//     drawBlack: req.body.drawBlack,
//     length: Math.floor(req.body.length),
//     bonus: Math.floor(req.body.bonus),
//   });
//   res.send(true);
// });

// //verify jwt token - if verification fails return temporary username for player
// app.post("/set-temp-login", async (req, res) => {
//   if (req.cookies["jwtAccess"]) {
//     try {
//       await jwt.verify(req.cookies["jwtAccess"], process.env.JWT_ACCESS_TOKEN);
//       return;
//     } catch (err) {
//       try {
//         await jwt.verify(
//           req.cookies["jwtRefresh"],
//           process.env.JWT_REFRESH_TOKEN
//         );
//         await jwt.sign(userObject, process.env.JWT_ACCESS_TOKEN, {
//           expiresIn: "15s",
//         });
//         return;
//       } catch (err) {
//         res.cookie("tempName", faker.internet.userName(), {
//           signed: true,
//         });
//       }
//     }
//   } else {
//     res.cookie("tempName", faker.internet.userName(), {
//       signed: true,
//     });
//   }
//   res.sendStatus(200);
// });

/*
app.post('/set-socket-id', (req, res) => {
    if (roomOptions.get(loginRoom.get(req.signedCookies.login))) {
        socketLogin.set(req.body.socketid, req.signedCookies.login);
        res.send(loginRoom.get(req.signedCookies.login));
    } else {
        res.send('');
    }
});

app.post('/validate-room-password', (req, res) => {
    bcrypt.compare(req.body.password, roomPasswd.get(req.body.fullRoomName), (err, result) => {
        if (result) {
            if (!roomPlayers[req.body.fullRoomName].includes(req.signedCookies.login)) {
                let temp = roomPlayers[req.body.fullRoomName];
                temp.push(req.signedCookies.login);
                roomPlayers[req.body.fullRoomName] = temp;
            }
            res.send(true);
        } else {
            res.send('Invalid password!');
        }
    });
});
*/

// app.use("/charades", charades);
/*
io.on("connection", (socket) => {
  console.log("client connected");

  socket.on("join-room-list", (data) => {
    console.log(`joining ${data} game list`);
    socket.join("game-" + data);
  });

  socket.on("load_rooms", (data) => {
    console.log(`returning ${data} room list`);
    io.to("game-" + data).emit("rooms", availableRooms(data));
  });

  socket.on("join-new-room", (data) => {
    let login = socketLogin.get(socket.id);
    let roomName = data.game + "-" + data.room;

    socket.join(roomName);
    console.log(`broadcasting ${data.game} room list`);
    io.to("game-" + data.game).emit("rooms", availableRooms(data.game));
    let logic;

    if (data.game == "chess") {
      if (!roomChesslogic.get(data.room)) {
        const opts = roomOptions.get(loginRoom.get(socketLogin.get(socket.id)));
        logic = new chessGame(login, opts.side == "white");
        roomChesslogic.set(data.room, logic);
      } else {
        logic = roomChesslogic.get(data.room);
        logic.setSecondPlayer(login);
      }
      io.to(roomName).emit(
        "chess-send-players-colours",
        logic.sendPlayersColors()
      );
    }
  });

  socket.on("disconnecting", () => {
    //todo: add delay
    if (socketLogin.get(socket.id)) {
      let full_room_name = loginRoom.get(socketLogin.get(socket.id));
      let game = full_room_name.substr(0, full_room_name.indexOf("-"));
      if (io.sockets.adapter.rooms.get(full_room_name).size == 1) {
        socket.leave(loginRoom.get(socketLogin.get(socket.id)));
        if (roomPasswd.get(full_room_name)) {
          roomPlayers[full_room_name].forEach((element) => {
            loginRoom.delete(element);
          });
          delete roomPlayers[full_room_name];
          roomPasswd.delete(full_room_name);
        }
        roomOptions.delete(full_room_name);
        roomTurn.delete(full_room_name);
        delete roomLastMove[full_room_name];
        delete roomBoard[full_room_name];
        if (full_room_name.indexOf("chess") == 0)
          delete roomChesslogic[full_room_name];
      }
      socketLogin.delete(socket.id);
      io.to("game-" + game).emit("rooms", availableRooms(game));
    }
    console.log("client disconnected");
  });

  socket.on("chess-color-req", () => {
    let reqLogin = socketLogin.get(socket.id);
    let reqRoom = loginRoom.get(reqLogin);

    let message = roomChesslogic
      .get(reqRoom.split("-")[1])
      .isReqPlayerWhite(reqLogin);
    io.to(socket.id).emit("chess-color-res", message);
  });

  socket.on("check-move-chess", (sRow, sCol, eRow, eCol) => {
    let reqLogin = socketLogin.get(socket.id);
    let reqRoom = loginRoom.get(reqLogin);

    let message = roomChesslogic
      .get(reqRoom.split("-")[1])
      .moveRequest(sRow, sCol, eRow, eCol, reqLogin);
    io.to(reqRoom).emit("server-chess-move", message);
  });

  socket.on("chess-undo-req", () => {
    let reqLogin = socketLogin.get(socket.id);
    let reqRoom = loginRoom.get(reqLogin);

    let logicRes = roomChesslogic
      .get(reqRoom.split("-")[1])
      .handleMoveReset(reqLogin);
    let help1 = Array.from(socketLogin.keys());
    let playerToNotify = help1.find((key) => socketLogin.get(key) === logicRes);
    io.to(playerToNotify).emit("chess-enemy-takeback-request");
  });

  socket.on("chess-undo-res", (consentGranted) => {
    let reqLogin = socketLogin.get(socket.id);
    let reqRoom = loginRoom.get(reqLogin);

    let move = roomChesslogic
      .get(reqRoom.split("-")[1])
      .handleMoveReset(reqLogin, consentGranted);
    io.to(reqRoom).emit("chess-takeback-server-response", move);
  });

  socket.on("chess-surrender", () => {
    let reqLogin = socketLogin.get(socket.id);
    let reqRoom = loginRoom.get(reqLogin);

    let message = roomChesslogic
      .get(reqRoom.split("-")[1])
      .handleSurrender(reqLogin);
    io.to(reqRoom).emit("server-chess-move", message);
  });

  socket.on("draw-chess", () => {
    let reqLogin = socketLogin.get(socket.id);
    let reqRoom = loginRoom.get(reqLogin);

    let logicRes = roomChesslogic
      .get(reqRoom.split("-")[1])
      .changeDrawProposition(reqLogin);
    if (logicRes) io.to(reqRoom).emit("server-chess-move", "P");
  });

  socket.on("message-sent-to-server", (msg) => {
    if (msg == "") return;
    const serverDate = new Date();

    let reqLogin = socketLogin.get(socket.id);
    let reqRoom = loginRoom.get(reqLogin);
    const minutes =
      serverDate.getMinutes().toString().length == 1
        ? `0${serverDate.getMinutes()}`
        : serverDate.getMinutes();
    const hours =
      serverDate.getHours().toString().length == 1
        ? `0${serverDate.getHours()}`
        : serverDate.getHours();

    const sendTime = `${hours}:${minutes}`;

    io.to(reqRoom).emit("message-sent-to-client", msg, reqLogin, sendTime);
  });

  socket.on("check-move-checkers", (tab) => {
    //checking if move is allowed
    if (tab[2] == roomTurn.get(loginRoom.get(socketLogin.get(socket.id)))) {
      var check = new Checkers(tab[2]);
      check.updateBoard(roomBoard[loginRoom.get(socketLogin.get(socket.id))]);
      roomLastMove[loginRoom.get(socketLogin.get(socket.id))] = [
        ...check.boarad,
      ];
      check.checed = tab[0];
      var move1 = check.convertId(check.checed);
      check.checkMoves(move1[0], move1[1]);
      if (check.inMoves(tab[1])) {
        io.to(loginRoom.get(socketLogin.get(socket.id))).emit("move", tab);
        var move2 = check.convertId(tab[1]);
        check.makeMove(move2[0], move2[1]);
        check.checkQueens();
        check.deletingBeated();
        roomBoard[loginRoom.get(socketLogin.get(socket.id))] = [
          ...check.boarad,
        ];
        if (roomTurn.get(loginRoom.get(socketLogin.get(socket.id))) == 1) {
          roomTurn.set(loginRoom.get(socketLogin.get(socket.id)), 0);
        } else {
          roomTurn.set(loginRoom.get(socketLogin.get(socket.id)), 1);
        }
      }
    }
  });

  socket.on("surrender-checkers", () => {
    io.to(loginRoom.get(socketLogin.get(socket.id))).emit("surrender");
  });

  socket.on("undo-checkers", () => {
    roomBoard[loginRoom.get(socketLogin.get(socket.id))] =
      roomLastMove[loginRoom.get(socketLogin.get(socket.id))];
    if (roomTurn.get(loginRoom.get(socketLogin.get(socket.id))) == 1) {
      roomTurn.set(loginRoom.get(socketLogin.get(socket.id)), 0);
    } else {
      roomTurn.set(loginRoom.get(socketLogin.get(socket.id)), 1);
    }
    io.to(loginRoom.get(socketLogin.get(socket.id))).emit(
      "undo-server",
      roomLastMove[loginRoom.get(socketLogin.get(socket.id))]
    );
  });

  socket.on("draw-checkers", () => {
    var opt = roomOptions.get(loginRoom.get(socketLogin.get(socket.id)));
    if (opt["white"] == socketLogin.get(socket.id)) {
      if (opt["drawWhite"] == true) {
        opt["drawWhite"] = false;
      } else {
        opt["drawWhite"] = true;
      }
      io.to(loginRoom.get(socketLogin.get(socket.id))).emit("change-draw", 1);
    }
    if (opt["black"] == socketLogin.get(socket.id)) {
      if (opt["drawBlack"] == true) {
        opt["drawBlack"] = false;
      } else {
        opt["drawBlack"] = true;
      }
      io.to(loginRoom.get(socketLogin.get(socket.id))).emit("change-draw", 0);
    }
    if (opt["drawBlack"] == true && opt["drawWhite"] == true) {
      io.to(loginRoom.get(socketLogin.get(socket.id))).emit("players-draw", 1);
    }
  });

  socket.on("ready", () => {
    var opt = roomOptions.get(loginRoom.get(socketLogin.get(socket.id)));
    if (opt["white"] == socketLogin.get(socket.id)) {
      if (opt["readyWhite"] == true) {
        opt["readyWhite"] = false;
      } else {
        opt["readyWhite"] = true;
      }
      io.to(loginRoom.get(socketLogin.get(socket.id))).emit("change-ready", 1);
    }
    if (opt["black"] == socketLogin.get(socket.id)) {
      if (opt["readyBlack"] == true) {
        opt["readyBlack"] = false;
      } else {
        opt["readyBlack"] = true;
      }
      io.to(loginRoom.get(socketLogin.get(socket.id))).emit("change-ready", 0);
    }
    if (opt["readyBlack"] == true && opt["readyWhite"] == true) {
      io.to(loginRoom.get(socketLogin.get(socket.id))).emit("players-ready", 1);
    }
  });

  socket.on("ready-check", () => {
    var opt = roomOptions.get(loginRoom.get(socketLogin.get(socket.id)));
    if (opt["readyBlack"] == true && opt["readyWhite"] == true) {
      io.to(loginRoom.get(socketLogin.get(socket.id))).emit(
        "players-ready",
        roomTurn.get(loginRoom.get(socketLogin.get(socket.id)))
      );
    }
  });

  socket.on("ask-options-checkers", () => {
    var roomId = loginRoom.get(socketLogin.get(socket.id));
    var opt = roomOptions.get(loginRoom.get(socketLogin.get(socket.id)));
    if (opt["white"] === "" && opt["black"] === "") {
      if (opt["side"] == 1) {
        opt["white"] = socketLogin.get(socket.id);
        io.to(roomId).emit("send-options-checkers", [1, 1, "Oponent"]);
      } else {
        opt["black"] = socketLogin.get(socket.id);
        io.to(roomId).emit("send-options-checkers", [2, 1, "Oponent"]);
      }
    } else {
      if (opt["white"] == "") {
        opt["white"] = socketLogin.get(socket.id);
        io.to(roomId).emit("send-options-checkers", [1, 1, opt["black"]]);
      } else {
        if (opt["black"] == "") {
          opt["black"] = socketLogin.get(socket.id);
          io.to(roomId).emit("send-options-checkers", [2, 1, opt["white"]]);
        } else {
          if (roomOptions.get(roomId)["white"] == socketLogin.get(socket.id)) {
            io.to(roomId).emit("send-options-checkers", [
              1,
              roomTurn.get(roomId),
              roomBoard[roomId],
              opt["black"],
            ]);
          } else {
            if (
              roomOptions.get(loginRoom.get(socketLogin.get(socket.id)))[
                "black"
              ] == socketLogin.get(socket.id)
            ) {
              io.to(roomId).emit("send-options-checkers", [
                2,
                roomTurn.get(roomId),
                roomBoard[roomId],
                opt["white"],
              ]);
            } else {
              io.to(roomId).emit("send-options-checkers", [
                -1,
                roomTurn.get(roomId),
                roomBoard[roomId],
                "Game",
              ]);
            }
          }
        }
      }
    }
  });
});

const availableRooms = (game) => {
  var availableRoomsTab = [];
  var rooms = io.sockets.adapter.rooms;
  for (let k of rooms.keys()) {
    if (k.startsWith(game)) {
      let inf = {
        fullRoomName: k,
        playerCount: rooms.get(k).size,
        options: roomOptions.get(k),
      };
      if (roomPasswd.get(k)) inf["password"] = true;
      else inf["password"] = false;
      availableRoomsTab.push(inf);
    }
  }
  return availableRoomsTab;
};
app.locals.availableRooms = availableRooms;
*/
