export const MONGO_CONNECTION_OPTIONS = {
  reconnectTries: 5,
  reconnectInterval: 500,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

export const MONGO_CONNECTION_STRING = "mongodb://mongo:27017/deckbay";
export const SALT_ROUNDS = 10;
