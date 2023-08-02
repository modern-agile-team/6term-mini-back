"use strict";

const db = require("../../config/db");

class movieStorage {
  static getmovie() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM movie";
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  static reserveSeat(id, movieId, seatRow, seatCol, seatDate) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO movie_seat (user_id, movie_id, seatRow, seatCol, seatDate) VALUES (${id}, ${movieId}, ${seatRow}, ${seatCol}, ${seatDate})`;
      db.query( query, (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }
}

module.exports = movieStorage;
