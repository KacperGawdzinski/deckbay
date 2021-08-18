import { combineReducers } from 'redux';

import socketioReducer from './sockerioReducer';
import usernameReducer from './userNameReducer';

export default combineReducers({
  username: usernameReducer,
  socketio: socketioReducer,
});
