import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, auto: true },
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

const User = mongoose.model("User", userSchema);
export default User;
