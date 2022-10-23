const BookModel = require("../models/book-model");
const BooksTakenModel = require("../models/booksThatAreTaken-model");
const UserModel = require("../models/user-model");
const hashService = require("../Services/hashService");

class BookController {
  async uploadBook(req, res) {
    const { name, authors, count, genre } = req.body;
    if (!name || !authors || !count || !genre) {
      return res.status(500).json({ message: "All fields are required" });
    }
    try {
      const book = await BookModel.findOne({ name, authors });
      if (!book) {
        const nBook = new BookModel({
          name,
          bookId: hashService.generateUniqueId(),
          authors,
          count,
          genre,
        });

        await nBook.save();
        return res.status(200).json({ message: "Uploaded the book in the db" });
      }
      //   console.log(book);
      book.count = book.count + count;
      book.save();
      return res
        .status(200)
        .json({ message: "Incresed the book number in the db" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Database fault,not able to upload the book,please try again ",
      });
    }
  }
  async deleteBook(req, res) {
    const { name, bookId, authors, count, genre } = req.body;
    if (!name || !authors || !count || !genre || !bookId) {
      return res.status(500).json({ message: "All fields are required" });
    }
    try {
      const book = await BookModel.findOne({ bookId });
      if (!book) {
        return res
          .status(500)
          .json({ message: "No such book present in the db" });
      }

      if (book.count - count <= 0) {
        book.remove();
      }
      book.count -= count;
      book.save();

      return res.status(200).json({ message: "Book is deleted from the db" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Database fault,not able to upload the book,please try again ",
      });
    }
  }

  async getBook(req, res) {
    const { user, bookId } = req.body;
    // console.log(user);
    // console.log(bookId);
    try {
      const ifUserHasThisBookAlready = await BooksTakenModel.findOne({
        bookId,
        userIDValue: user.userIDValue,
      });
      if (ifUserHasThisBookAlready) {
        return res.status(500).json({ message: "You already have this book" });
      }
      const book = await BookModel.findOne({ bookId });

      if (book.count == 0) {
        return res.status(200).json({
          message:
            "This book is not present in the library , please get more details from the reception",
        });
      }

      if (user.book1 == null) {
        user.book1 = book.name;
      } else if (user.book2 == null) {
        user.book2 = book.name;
      } else if (user.book3 == null) {
        user.book3 = book.name;
      } else {
        return res
          .status(500)
          .json({ message: "Return some of the books to get any more" });
      }
      user.save();
      book.count = book.count - 1;
      const newBookTaken = new BooksTakenModel({
        bookId,
        userIDValue: user.userIDValue,
      });
      newBookTaken.save();
      book.save();
      return res.status(200).json({
        message: `Collect your book from the reception with id ${bookId}`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Database sleeping" });
    }
  }

  async returnBook(req, res) {
    const { bookId, userIDValue } = req.body;
    if (!bookId || !userIDValue) {
      return res.status(500).json({ message: "all fields are required" });
    }
    try {
      const takenBook = await BooksTakenModel.findOne({ bookId, userIDValue });
      takenBook.remove();
      const book = await BookModel.findOne({ bookId });
      book.count += 1;
      book.save();
      const user = await UserModel.findOne({ userIDValue });
      if (user.book1 == book.name) {
        user.book1 = null;
      } else if (user.book2 == book.name) {
        user.book2 = null;
      } else {
        user.book3 = null;
      }

      user.save();
      return res.status(200).json({ message: "book submitted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Db is sleeping" });
    }
  }
}

module.exports = new BookController();
