"use strict";

const db = require("../../config/db");

class movieStorage {
  static getMovielike() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM movie_likes", (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  static checkUserMovieLike(movieid, userid) {
    // 로그인한 유저가 해당 영화에 좋아요를 클릭했는지 확인
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM movie_likes WHERE user_id = ? AND movie_id = ?",
        [userid, movieid],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results.length > 0);
          }
        }
      );
    });
  }

  static addMovieLike(movieid, userid) {
    // 로그인한 유저가 해당 영화에 좋아요를 클릭
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO movie_likes (user_id, movie_id) VALUES (?, ?)",
        [userid, movieid],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve({ success: true, msg: "좋아요가 추가되었습니다." });
          }
        }
      );
    });
  }

  static removeMovieLike(movieid, userid) {
    // 로그인한 유저가 해당 영화에 좋아요 클릭한것을 취소
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM movie_likes WHERE user_id = ? AND movie_id = ?",
        [userid, movieid],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve({ success: true, msg: "좋아요가 취소되었습니다." });
          }
        }
      );
    });
  }
}
module.exports = movieStorage;
