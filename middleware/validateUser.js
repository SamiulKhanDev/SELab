const tokenService = require("../Services/tokenServiceUser");
const UserModel = require("../models/user-model");
const authMiddleWare = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(500).json({ message: "cookie expired", user: null });
  }
  try {
    const userData = await tokenService.verifyAccessToken(accessToken);
    if (!userData) {
      return res
        .status(401)
        .json({ message: "Invalid access token", user: null });
    }

    const user = await UserModel.findOne({ userIDValue: userData.uniqueId });

    req.body.user = user;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "No user found" });
  }

  next();
};

module.exports = authMiddleWare;
