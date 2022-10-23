const crypto = require("crypto");

class HashService {
  generateHash(data) {
    const hmac = crypto.createHmac("sha256", process.env.PASSWORD_SALT);
    return hmac.update(data.toString()).digest("hex");
  }

  varifyHash(user, password) {
    const hash = this.generateHash(password);
    return user.password === hash;
  }
  generateUniqueId() {
    return crypto.randomBytes(32).toString("hex");
  }
}

const obj = new HashService();
module.exports = obj;
