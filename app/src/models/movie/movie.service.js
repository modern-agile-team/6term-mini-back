"use strict";

const movieStorage = require("./movie.storage");
const Token = require("../Token/Token");

class Movie {
  async getmovie() {
    try {
      return await movieStorage.getmovie();
    } catch (error) {
      return { sucess: false, msg: "movie.js 오류" };
    }
  }

  async reserveSeat(accessToken, movieId, seatRow, seatCol, seatDate) {
    try {
      const decodedToken = await Token.decodeToken(accessToken);
      const id = decodedToken.id;
      const reserveSeat = await movieStorage.reserveSeat(id, movieId, seatRow, seatCol, seatDate);
      
      if (reserveSeat.affectedRows === 1) {
        return { sucess: true, msg: "좌석 예매 성공" };
      } else {
        return { sucess: false, msg: "좌석 예매 실패" };
      }
    } catch (error) {
      return { sucess: false, msg: "좌석 예매 movie.service.js 오류" };
    }
  }
}

module.exports = Movie;
