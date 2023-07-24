"user strict";

const db = require("../../config/db");

class UserStorage {
  async login(login_id, pw) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE login_id = ?;";
      db.query(query, [login_id], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data[0]);
      });
    });
  }

  async saveRefreshToken(refreshToken) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO token (refresh_token) VALUES (?);";
      db.query(query, [refreshToken], (err, data) => {
        if (err) reject(`${err}`);
        resolve({ success: true, msg: "리프레시 토큰 저장 완료" });
      });
    });
  }
}

module.exports = UserStorage;
