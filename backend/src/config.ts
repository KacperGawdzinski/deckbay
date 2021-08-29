export const MONGO_CONNECTION_OPTIONS = {
  reconnectTries: 5,
  reconnectInterval: 500,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

export const CORS_OPTIONS = {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
};

export const MONGO_CONNECTION_STRING = "mongodb://mongo:27017/deckbay";
export const SALT_ROUNDS = 10;
