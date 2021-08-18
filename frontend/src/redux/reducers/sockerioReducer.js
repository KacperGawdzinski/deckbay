import { io } from 'socket.io-client';

const initialState = io();

const socketioReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_SOCKET':
      return io();
    default:
      return state;
  }
};

export default socketioReducer;
