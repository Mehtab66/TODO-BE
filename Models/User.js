const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
