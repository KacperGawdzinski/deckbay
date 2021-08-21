export const GAME_LIST = ['Checkers', 'Chess', 'Charades'];
export const LOADING_STEPS = {
  INPUT_DATA: 1,
  FETCHING_RESPONSE: 2,
  POSITIVE_RESPONSE: 3,
  NEGATIVE_RESPONSE: 4,
};

export const GAME_MAX_PLAYERS = {
  chess: 2,
  checkers: 2,
  charades: 10,
};

export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
