"use strict";

const db = require("../../config/db");

class movieStorage {
  static getmovie() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM movie", (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }
}

module.exports = movieStorage;
