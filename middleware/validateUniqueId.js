const UniqueIdModel = require("../models/uniqueId-model");
const AdminModel = require("../models/admin-model");

const validateUniqueId = async (req, res, next) => {
  const { name, uniqueId, phone, email, password } = req.body;
  if (!name || !uniqueId || !phone || !email || !password) {
    return res.status(500).json({ message: "All fields are requird" });
  }

  const id = await UniqueIdModel.findOne({ uniqueId: uniqueId });
  if (!id) {
    return res.status(500).json({ message: "Not a valid id" });
  }
  let admin = await AdminModel.findOne({ uniqueId });
  if (admin) {
    return res
      .status(500)
      .json({ message: "Admin with this unique id is already present" });
  }
  admin = await AdminModel.findOne({ phone });
  if (admin) {
    return res
      .status(500)
      .json({ message: "Admin with this phone is already present" });
  }
  admin = await AdminModel.findOne({ email });
  if (admin) {
    return res
      .status(500)
      .json({ message: "Admin with this email is already present" });
  }

  next();
};
module.exports = validateUniqueId;
