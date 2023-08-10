"use strict";

const db = require("../../config/db");

class movieStorage {
  static async getSeat() {
    try {
      const sql = `SELECT movie_id AS movieId,seatRow,seatCol,seatDate FROM movie_seat`;
      return (await db.query(sql))[0];
    } catch (error) {
      console.log("getSeat moviestorage 오류 :", error);
      return { success: false };
    }
  }

  static async checkSeat(movieId, seatRow, seatCol, seatDate) {
    try {
      const params = [movieId, seatRow, seatCol, seatDate];
      const sql = `
        SELECT CASE WHEN EXISTS (SELECT 1 FROM movie_seat WHERE movie_id = ? AND seatRow = ? AND seatCol = ? AND seatDate = ?) THEN 1 ELSE 0 END AS isReserved`;
      const result = (await db.query(sql, params))[0];
      return result[0].isReserved;
    } catch (error) {
      console.log("checkSeat moviestorage 오류 :", error);
      return { success: false };
    }
  }

  static async getUserSeat(id) {
    try {
      const req = [id];
      const sql = `SELECT id,movie_id AS movieId,seatRow,seatCol,seatDate FROM movie_seat WHERE user_id = ?`;
      return (await db.query(sql, req))[0];
    } catch (error) {
      console.log("getUserSeat moviestorage 오류 :", error);
      return { success: false };
    }
  }

  static async reserveSeat(id, movieId, seatRow, seatCol, seatDate) {
    try {
      const req = [id, movieId, seatRow, seatCol, seatDate];
      const sql = `INSERT INTO movie_seat (user_id, movie_id, seatRow, seatCol, seatDate) VALUES (?, ?, ?, ?, ?)`;
      return (await db.query(sql, req))[0];
    } catch (error) {
      console.log("reserveSeat moviestorage 오류 :", error);
      return { succes: false };
    }
  }

  static async cancelSeat(id) {
    try {
      const req = [id];
      const sql = `DELETE FROM movie_seat WHERE id = ?`;
      return (await db.query(sql, req))[0];
    } catch (error) {
      console.log("cacelSeat moviestorage 오류 : ", error);
      return { succes: false };
    }
  }
}

module.exports = movieStorage;
