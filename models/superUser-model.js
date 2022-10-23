const mongoose = require("mongoose");

const superUserSchema = new mongoose.Schema(
  {
    superUserId: { type: String, requird: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SuperUser", superUserSchema, "superusers");
