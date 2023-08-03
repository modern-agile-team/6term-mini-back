"use strict";

const db = require("../../config/db");

class movieStorage {
  static async getmovie() {
    try {
      const sql = `SELECT * FROM movie`;
      const results = await db.query(sql);
      return results[0];
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = movieStorage;
