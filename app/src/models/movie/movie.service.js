"use strict";

const movieStorage = require("./movie.storage");
const Token = require("../Token/Token");

class Movie {
  async getMovie(accessToken) {
    try {
      const id = await Token.decodeToken(accessToken);
      const movieInfo = await movieStorage.getMovie(id);
      return { sucess: true, msg: "영화 조회 성공", movieInfo };
    } catch (error) {
      console.log(error);
      return { sucess: false, msg: "movie.js 오류" };
    }
  }

  async getSeat() {
    try {
      await movieStorage.deleteExpiredSeats();
      const seat = await movieStorage.getSeat();
      return { sucess: true, msg: "좌석 조회 성공", seat };
    } catch (error) {
      console.log(error);
      return { sucess: false, msg: "좌석 조회 movie.service.js 오류" };
    }
  }

  async getUserSeat(accessToken) {
    try {
      await movieStorage.deleteExpiredSeats();
      const id = await Token.decodeToken(accessToken);
      const userSeat = await movieStorage.getUserSeat(id);
      if (!userSeat.length) {
        return { sucess: false, msg: "예매된 좌석이 없습니다." };
      }
      return { sucess: true, msg: "유저 좌석 조회 성공", userSeat };
    } catch (error) {
      console.log(error);
      return { sucess: false, msg: "유저 좌석 조회 movie.service.js 오류" };
    }
  }

  async reserveSeat(accessToken, movieId, seatRow, seatCol, seatDate) {
    try {
      const id = await Token.decodeToken(accessToken);
      const seats = await movieStorage.checkSeat(
        movieId,
        seatRow,
        seatCol,
        seatDate
      );

      if (seats) {
        return { sucess: false, msg: "이미 예매된 좌석입니다." };
      }

      const reserveSeat = await movieStorage.reserveSeat(
        id,
        movieId,
        seatRow,
        seatCol,
        seatDate
      );
      if (reserveSeat.affectedRows) {
        return { sucess: true, msg: "예매를 성공했습니다." };
      } else {
        return { sucess: false, msg: "예매를 실패했습니다." };
      }
    } catch (error) {
      console.log(error);
      return { sucess: false, msg: "좌석 예매 movie.service.js 오류" };
    }
  }

  async cancelSeat(id) {
    try {
      const cancelSeat = await movieStorage.cancelSeat(id);
      if (cancelSeat.affectedRows) {
        return { sucess: true, msg: "예매를 취소했습니다." };
      } else {
        return { sucess: false, msg: "예매되지 않은 좌석입니다." };
      }
    } catch (error) {
      console.log(error);
      return { sucess: false, msg: "좌석 예매 취소 movie.service.js 오류" };
    }
  }

  async updatemovielike(movieid, accessToken) {
    try {
      const userId = await Token.decodeToken(accessToken);
      const like = await movieStorage.checkUserMovieLike(movieid, userId);
      if (like) {
        await movieStorage.removeMovieLike(movieid, userId);
        return { success: true, msg: "좋아요를 취소했습니다.", state: false };
      } else {
        await movieStorage.addMovieLike(movieid, userId);
        return { success: true, msg: "좋아요를 눌렀습니다.", state: true };
      }
    } catch (error) {
      return { success: false, msg: "좋아요 업데이트 movie.service 오류" };
    }
  }
}

module.exports = Movie;
