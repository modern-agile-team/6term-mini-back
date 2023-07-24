"user strict";

const UserStorage = require("./UserStorage");

class User {
  constructor(body) {
    this.body = new UserStorage(body);
  }

  async login(login_id, pw) {
    try {
      const response = await this.body.login(login_id, pw);
      return response;
    } catch (err) {
      return { success: false, msg: "로그인 에러" };
    }
  }

  async saveRefreshToken(refreshToken) {
    try {
      const response = await this.body.saveRefreshToken(refreshToken);
      return response;
    } catch (err) {
      return { success: false, msg: "리프레시 토큰 저장 에러" };
    }
  }
}

module.exports = User;
