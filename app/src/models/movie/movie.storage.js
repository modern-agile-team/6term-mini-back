"use strict";

const db = require("../../config/db");

class movieStorage {
  static async getMovie() {
    try {
      const sql = `
            SELECT movie.id AS movie_id,movie.movie_title,movie.movie_poster,movie.movie_runtime,COUNT(movie_likes.id) AS like_count
            FROM movie
            LEFT JOIN 
              movie_likes ON movie.id = movie_likes.movie_id
            GROUP BY 
              movie.id, movie.movie_title, movie.movie_poster, movie.movie_runtime;
        `;
      return (await db.query(sql))[0];
    } catch (error) {
      console.log("getMovie movieStorage 오류 :", error);
      throw error;
    }
  }

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

  static async deleteExpiredSeats() {
    try {
      const sql = `DELETE FROM movie_seat WHERE seatDate < CURDATE()`;
      await db.query(sql);
      return { success: true, msg: "만료된 좌석 삭제 성공" };
    } catch (error) {
      console.log("deleteExpiredSeats moviestorage 오류:", error);
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
      return (await db.query(sql, params))[0];
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
      return (await db.query(sql, params))[0];
    } catch (error) {
      console.log("removeMovielike moviestorage 오류 :", error);
      return { success: false };
    }
  }
}

module.exports = movieStorage;
