import { Action } from 'redux';
import { io, Socket } from 'socket.io-client';

const socketioReducer = (state = {}, action: Action) => {
  switch (action.type) {
    case 'CONNECT_SOCKET':
      return io('http://localhost:5000');
    case 'RESET_SOCKET':
      return io('http://localhost:5000');
    default:
      return state;
  }
};

export default socketioReducer;
