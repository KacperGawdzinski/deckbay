import { combineReducers } from 'redux';

import usernameReducer from './userNameReducer';

export default combineReducers({
  username: usernameReducer,
});
