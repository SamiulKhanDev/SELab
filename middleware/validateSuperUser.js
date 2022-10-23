const SuperUserModel = require("../models/superUser-model");

const validateSuperUser = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(500).json({ message: "Id is requird" });
  }
  const superUser = await SuperUserModel.findOne({ superUserId: id });
  if (!superUser) {
    return res.status(401).json({ message: "Not a superUser" });
  }
  next();
};

module.exports = validateSuperUser;
