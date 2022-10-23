const express = require("express");
const router = express.Router();
const cryoto = require("crypto");
const UniqueIdModel = require("../models/uniqueId-model");

router.get("/", async (req, res) => {
  const ranId = generateRandomIds();
  // console.log(ranId);
  const id = await UniqueIdModel.findOne({ uniqueId: ranId });
  if (!id) {
    await UniqueIdModel.create({ uniqueId: ranId });
    return res.status(200).json({ id: ranId });
  }
  return res.status(500).json({ message: "Failed to genearte a unique id" });
});

const generateRandomIds = () => {
  return cryoto.randomBytes(32).toString("hex");
};

module.exports = router;
