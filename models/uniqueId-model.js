const mongoose = require("mongoose");
const uniqueIdSchema = new mongoose.Schema(
  {
    uniqueId: { type: String, requird: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UniqueId", uniqueIdSchema, "uniqueIds");
