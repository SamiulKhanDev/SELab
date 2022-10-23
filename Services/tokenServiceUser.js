const jwt = require("jsonwebtoken");
const refreshTokenModel = require("../Models/refreshTokenUser-model");
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SCERET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SCERET;
class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "24h",
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "1y",
    });

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, accessTokenSecret);
  }

  async storeRefreshToken(token, userId) {
    return await refreshTokenModel.create({
      token: token,
      userId: userId,
    });
  }
  async verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, refreshTokenSecret);
  }
  async findRefreshToken(userId, refreshToken) {
    return await refreshTokenModel.findOne({
      userId: userId,
      token: refreshToken,
    });
  }
  async updateRefreshToken(userId, refreshToken) {
    return await refreshTokenModel.updateOne(
      { userId },
      { token: refreshToken }
    );
  }

  async removeToken(refreshToken) {
    await refreshTokenModel.deleteOne({ token: refreshToken });
  }
}

module.exports = new TokenService();
