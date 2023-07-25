"use strict";

const db = require("../../config/db");

class movieStorage {
  static getmovielike() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM movie_likes", (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  static updatemovielike(movieid, userid) {
    return new Promise((resolve, reject) => {
      // 로그인한 유저가 해당 영화를 좋아요 했는지 확인
      db.query(
        "SELECT * FROM movie_likes WHERE user_id = ? AND movie_id = ?",
        [userid, movieid],
        (err, results) => {
          if (err) {
            reject(err);
          } else if (results.length > 0) {
            // 이미 해당 유저가 해당 영화를 좋아요 했다면, 좋아요를 취소
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
          } else {
            // 해당 유저가 해당 영화를 좋아요 하지 않았다면, 좋아요를 추가
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
          }
        }
      );
    });
  }
}
module.exports = movieStorage;
