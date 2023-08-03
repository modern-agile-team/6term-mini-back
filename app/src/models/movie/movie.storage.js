"use strict";

const db = require("../../config/db");

class movieStorage {
  static async getMovielike() {
    try {
      const sql = `SELECT * FROM movie_likes`;
      const resolve = await db.query(sql);
      return resolve[0];
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
      const resolve = await db.query(sql, params);
      return resolve[0];
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
      const resolve = await db.query(sql, params);
      return resolve[0];
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
      const resolve = await db.query(sql, params);
      return resolve[0];
    } catch (error) {
      console.log("removeMovielike moviestorage 오류 :", error);
      return { success: false };
    }
  }
}

module.exports = movieStorage;
