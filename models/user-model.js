const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userIDValue: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  book1: { type: String, required: false, default: null },
  book2: { type: String, required: false, default: null },
  book3: { type: String, required: false, default: null },
});
module.exports = mongoose.model("User", userSchema, "users");
