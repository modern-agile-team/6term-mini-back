"user strict";

const db = require("../../config/db");

class UserStorage {
  async login(loginId, pw) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE login_id = ?;";
      db.query(query, [loginId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data[0]);
      });
    });
  }

  async register(loginId, email, pw) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO user (login_id, email, pw) VALUES (?, ?, ?);";
      db.query(query, [loginId, email, pw], (err, data) => {
        if (err) reject(`${err}`);
        resolve({ success: true, msg: "회원가입 완료" });
      });
    });
  }

  async findLoginId(email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT login_id FROM user WHERE email = ?;";
      db.query(query, [email], (err, data) => {
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

  async checkRefreshToken(refreshToken) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM token WHERE refresh_token = ?;";
      db.query(query, [refreshToken], (err, data) => {
        if (err) reject(`${err}`);
        resolve({ success: true, msg: "리프레시 토큰 검증 완료" });
      });
    });
  }
}

module.exports = UserStorage;
