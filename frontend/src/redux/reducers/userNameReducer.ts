import IUsernameAction from '../actionTypes/IUsernameAction';

const initialState = '';

const usernameReducer = (state = initialState, action: IUsernameAction) => {
  switch (action.type) {
    case 'LOG_IN':
      return action.payload;
    case 'LOG_OUT':
      return '';
    default:
      return state;
  }
};

export default usernameReducer;
