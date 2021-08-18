import { io } from 'socket.io-client';

const initialState = io('http://localhost:5000');

const socketioReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_SOCKET':
      return io('http://localhost:5000');
    default:
      return state;
  }
};

export default socketioReducer;
