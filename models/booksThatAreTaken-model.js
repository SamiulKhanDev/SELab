const mongoose = require("mongoose");
const BookThatAreTakenModel = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
  },
  userIDValue: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "BooksTaken",
  BookThatAreTakenModel,
  "bookstaken"
);
