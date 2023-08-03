"use strict";

const db = require("../../config/db");

class movieStorage {
  static async getmovie() {
    try {
      const sql = `SELECT * FROM movie`;
      const results = (await db.query(sql))[0];
      return results;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = movieStorage;
