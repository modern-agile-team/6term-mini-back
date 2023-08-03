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

  static async getSeat() {
    try {
      const sql = `SELECT * FROM movie_seat`;
      const resolve = (await db.query(sql))[0];
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
      const resolve = (await db.query(sql, req))[0];
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
      const resolve = (await db.query(sql, req))[0];
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
      const resolve = (await db.query(sql, req))[0];
      return resolve;
    } catch (error) {
      console.log("cacelSeat moviestorage 오류 : ", error);
      return { succes: false };
    }
  }

  static async getMovielike(movieId) {
    try {
      const sql = `SELECT COUNT(movie_id) AS count FROM movie_likes WHERE movie_id IN (?)`;
      const resolve = (await db.query(sql, [movieId]))[0];
      return resolve;
    } catch (error) {
      console.log("getMovielike moviestorage 오류 :", error);
      return { success: false };
    }
  }

  static async checkUserMovieLike(movieId, userId) {
    // 로그인한 유저가 해당 영화에 좋아요를 클릭했는지 확인
    try {
      const params = [userId, movieId];
      const sql = `SELECT * FROM movie_likes WHERE user_id = ? AND movie_id = ?`;
      const resolve = (await db.query(sql, params))[0];
      if (resolve.length === 0) {
        return false;
      }
      return resolve;
    } catch (error) {
      console.log("checkmovielike moviestorage 오류 :", error);
      return { success: false };
    }
  }

  static async addMovieLike(movieId, userId) {
    // 로그인한 유저가 해당 영화에 좋아요를 클릭
    try {
      const params = [userId, movieId];
      const sql = `INSERT INTO movie_likes (user_id, movie_id) VALUES (?, ?)`;
      const resolve = (await db.query(sql, params))[0];
      return resolve;
    } catch (error) {
      console.log("addmovielike moviestorage 오류 :", error);
      return { success: false };
    }
  }

  static async removeMovieLike(movieId, userId) {
    // 로그인한 유저가 해당 영화에 좋아요 클릭한것을 취소
    try {
      const params = [userId, movieId];
      const sql = `DELETE FROM movie_likes WHERE user_id = ? AND movie_id = ?`;
      const resolve = (await db.query(sql, params))[0];
      return resolve;
    } catch (error) {
      console.log("removeMovielike moviestorage 오류 :", error);
      return { success: false };
    }
  }
}

module.exports = movieStorage;
