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
}

module.exports = UserStorage;
