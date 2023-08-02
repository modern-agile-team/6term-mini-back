"use strict";

const db = require("../../config/db");

class movieStorage {

  static getSeat() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM movie_seat";
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  static getUserSeat(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM movie_seat WHERE user_id = ?";
      db.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  static reserveSeat(id, movieId, seatRow, seatCol, seatDate) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO movie_seat (user_id, movie_id, seatRow, seatCol, seatDate) VALUES (?, ?, ?, ?, ?)";
      db.query(
        query,
        [id, movieId, seatRow, seatCol, seatDate],
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  static cancelSeat(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM movie_seat WHERE id = ?";
      db.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }
}

module.exports = movieStorage;
