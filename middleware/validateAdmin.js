const tokenService = require("../Services/tokenService");
const authMiddleWare = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(500).json({ message: "cookie expired", admin: null });
  }

  const userData = await tokenService.verifyAccessToken(accessToken);
  if (!userData) {
    return res
      .status(401)
      .json({ message: "Invalid access token", admin: null });
  }

  next();
};

module.exports = authMiddleWare;
