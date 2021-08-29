import { ChessRoomInfo } from "../dataTypes/chessTypes";

export const chessRoomInfoTab: ChessRoomInfo[] = [
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
    roomName: "unlocked2",
    gameLength: 1,
    bonusTime: 1,
    players: 2,
    observators: 3,
    hasStarted: true,
  },
];
