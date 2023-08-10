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
}

module.exports = movieStorage;
