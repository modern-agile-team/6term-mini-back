"use strict";

const db = require("../../config/db");

class movieStorage {
  static async getSeat() {
    try {
      const sql = `SELECT * FROM movie_seat`;
      const resolve = (await db.query(sql))[0][0];
      return resolve;
    } catch (error) {
      console.log("getSeat moviestorage 오류 :", error);
      return { succes: false };
    }
  }

  static async getUserSeat(id) {
    try {
      const req = [id];
      const sql = `SELECT * FROM movie_seat WHERE user_id = ?`;
      const resolve = (await db.query(sql, req))[0][0];
      return resolve;
    } catch (error) {
      console.log("getUserSeat moviestorage 오류 :", error);
      return { succes: false };
    }
  }

  static async reserveSeat(id, movieId, seatRow, seatCol, seatDate) {
    try {
      const req = [id, movieId, seatRow, seatCol, seatDate];
      const sql = `INSERT INTO movie_seat (user_id, movie_id, seatRow, seatCol, seatDate) VALUES (?, ?, ?, ?, ?)`;
      const resolve = (await db.query(sql, req))[0][0];
      return resolve;
    } catch (error) {
      console.log("reserveSeat moviestorage 오류 :", error);
      return { succes: false };
    }
  }

  static async cancelSeat(id) {
    try {
      const req = [id];
      const sql = `DELETE FROM movie_seat WHERE id = ?`;
      const resolve = (await db.query(sql, req))[0][0];
      return resolve;
    } catch (error) {
      console.log("cacelSeat moviestorage 오류 : ", error);
      return { succes: false };
    }
  }
}

module.exports = movieStorage;
