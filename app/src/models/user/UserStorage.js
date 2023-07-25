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

  async logout(refreshToken) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM token WHERE refresh_token = ?;";
      db.query(query, [refreshToken], (err, data) => {
        if (err) reject(`${err}`);
        if (data.affectedRows === 0) resolve({ success: false, msg: "refreshToken is not valid" });
        resolve({ success: true, msg: "로그아웃 완료" });
      });
    });
  }

  async register(loginId, email, pw) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO user (login_id, email, pw) VALUES (?, ?, ?);";
      db.query(query, [loginId, email, pw], (err, data) => {
        if (err) reject(`${err}`);
        resolve({ success: true, msg: "회원가입 완료", loginId, email });
      });
    });
  }

  async checkUserLoginId(loginId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT EXISTS (SELECT * FROM user WHERE login_id = ?) AS success;";
      db.query(query, [loginId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data[0].success);
      });
    });
  }

  async checkUserEmail(email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT EXISTS (SELECT * FROM user WHERE email = ?) AS success;";
      db.query(query, [email], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data[0].success);
      });
    });
  }

  async findLoginId(email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT login_id FROM user WHERE email = ?;";
      db.query(query, [email], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data[0]?.login_id || null); // data[0]이 존재하면 data[0].login_id를, 존재하지 않으면 null을 반환
      });
    });
  }

  async findPw(loginId, email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT pw FROM user WHERE login_id = ? AND email = ?;";
      db.query(query, [loginId, email], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data[0]?.pw || null); // data[0]이 존재하면 data[0].pw를, 존재하지 않으면 null을 반환
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
        if (data.length > 0) resolve({ success: true, msg: "리프레시 토큰 검증 완료" });
        resolve({ success: false, msg: "refreshToken is not valid" });
      });
    });
  }
}

module.exports = UserStorage;
