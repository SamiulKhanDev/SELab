const mongoose = require("mongoose");
const BookModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("Book", BookModel, "books");
