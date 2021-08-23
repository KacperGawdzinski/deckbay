export interface ChessRoomInfo {
  password: boolean;
  roomName: string;
  gameLength: number;
  bonusTime: number;
  players: number;
  observators: number;
  hasStarted: boolean;
}

export interface ChessRoomGame {
  //game: chessGame;
  roomName: string;
  players: string[];
  password: string;
}
