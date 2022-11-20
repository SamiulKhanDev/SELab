const mongoose = require("mongoose");
const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database is connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = db;
