const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: [true, "User with given email already exists"],
  },
  username: {
    type: String,
    required: true,
    unique: [true, "User with given username already exists"],
  },
  password: {
    type: String,
    required: true,
  },
});

export default User = mongoose.model("User", userSchema);
