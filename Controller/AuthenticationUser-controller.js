const UserModel = require("../models/user-model");
const hashService = require("../Services/hashService");
const tokenService = require("../Services/tokenServiceUser");
class AuthController {
  async signUp(req, res) {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !email || !password) {
      return res.status(500).json({ message: "All fields are requird" });
    }
    let user;
    try {
      const saltedPassword = hashService.generateHash(password);

      user = new UserModel({
        userIDValue: hashService.generateUniqueId(),
        name,

        phone,
        email,
        password: saltedPassword,
      });
      console.log(user);

      user.save();
    } catch (error) {
      return res.status(500).json({ message: "user generation failed" });
    }

    return res.status(200).json({ message: "Sign up Complete", user });
  }
  async signIn(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user || !hashService.varifyHash(user, password)) {
      return res.status(401).json({ message: "Invalid credentitals" });
    }

    const { accessToken, refreshToken } = tokenService.generateTokens({
      uniqueId: user.userIDValue,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true, //only the server will be able to read ,
    });
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    return res.status(200).json({ message: "Succesfully signed in", user });
  }
  async logout(req, res) {
    const { refreshToken } = req.cookies;

    await tokenService.removeToken(refreshToken);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res.status(200).json({ user: null });
  }
}

module.exports = new AuthController();
