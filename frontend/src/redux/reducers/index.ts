import { combineReducers } from 'redux';
import socketioReducer from './sockerioReducer';
import usernameReducer from './userNameReducer';

export const rootReducer = combineReducers({
  username: usernameReducer,
  socket: socketioReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
