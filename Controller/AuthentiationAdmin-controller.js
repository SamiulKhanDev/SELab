const AdminModel = require("../models/admin-model");
const hashService = require("../Services/hashService");
const tokenService = require("../Services/tokenService");
class AuthController {
  async signUp(req, res) {
    const { name, uniqueId, phone, email, password } = req.body;
    if (!name || !uniqueId || !phone || !email || !password) {
      return res.status(500).json({ message: "All fields are requird" });
    }
    const saltedPassword = hashService.generateHash(password);

    const admin = new AdminModel({
      name,
      uniqueId,
      phone,
      email,
      password: saltedPassword,
    });
    try {
      await admin.save();
    } catch (error) {
      return res.status(500).json({ message: "Admin generation failed" });
    }

    return res.status(200).json({ message: "Sign up Complete", admin });
  }
  async signIn(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({ message: "All fields are required" });
    }

    const admin = await AdminModel.findOne({ email });

    if (!admin || !hashService.varifyHash(admin, password)) {
      return res.status(401).json({ message: "Invalid credentitals" });
    }

    const { accessToken, refreshToken } = tokenService.generateTokens({
      uniqueId: admin.uniqueId,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true, //only the server will be able to read ,
    });
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    return res.status(200).json({ message: "Succesfully signed in", admin });
  }
  async logout(req, res) {
    const { refreshToken } = req.cookies;

    await tokenService.removeToken(refreshToken);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.clea;

    res.status(200).json({ admin: null });
  }
}

module.exports = new AuthController();
