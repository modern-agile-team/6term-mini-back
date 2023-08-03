"use strict";

const movieStorage = require("./movie.storage");
const Token = require("../Token/Token");

class Movie {
  async getmovie() {
    try {
      const movie = await movieStorage.getmovie();

      const idArray = movie.map((item) => item.id);
      const movieLike = await Promise.all(
        idArray.map((id) => movieStorage.getMovielike(id))
      );
      const movieInfo = movie.map((item, index) => {
        const like = movieLike[index][0]?.count || 0;
        return { ...item, like };
      });

      return { sucess: true, msg: "영화 조회 성공", movieInfo };
    } catch (error) {
      console.log(error);
      return { sucess: false, msg: "movie.js 오류" };
    }
  }

  async getSeat() {
    try {
      const seat = await movieStorage.getSeat();
      const extractedValues = seat.map((item) => {
        return {
          movieId: item.movie_id,
          seatRow: item.seatRow,
          seatCol: item.seatCol,
          seatDate: item.seatDate,
        };
      });
      return { sucess: true, msg: "좌석 조회 성공", extractedValues };
    } catch (error) {
      console.log(error);
      return { sucess: false, msg: "좌석 조회 movie.service.js 오류" };
    }
  }

  async getUserSeat(accessToken) {
    try {
      const decodedToken = await Token.decodeToken(accessToken);
      const id = decodedToken.id;

      const seat = await movieStorage.getUserSeat(id);
      const extractedValues = seat.map((item) => {
        return {
          id: item.id,
          movieId: item.movie_id,
          seatRow: item.seatRow,
          seatCol: item.seatCol,
          seatDate: item.seatDate,
        };
      });
      return { sucess: true, msg: "유저 좌석 조회 성공", extractedValues };
    } catch (error) {
      console.log(error);
      return { sucess: false, msg: "유저 좌석 조회 movie.service.js 오류" };
    }
  }

  async reserveSeat(accessToken, movieId, seatRow, seatCol, seatDate) {
    try {
      const decodedToken = await Token.decodeToken(accessToken);
      const id = decodedToken.id;

      const seats = await this.getSeat();
      const isSeatReserved = seats.extractedValues.some((seat) => {
        return (
          seat.movieId === Number(movieId) &&
          seat.seatRow === Number(seatRow) &&
          seat.seatCol === Number(seatCol) &&
          seat.seatDate === Number(seatDate)
        );
      });

      if (isSeatReserved) {
        return { sucess: false, msg: "이미 예매된 좌석입니다." };
      }

      const reserveSeat = await movieStorage.reserveSeat(
        id,
        movieId,
        seatRow,
        seatCol,
        seatDate
      );

      if (reserveSeat.affectedRows === 1) {
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

      if (cancelSeat.affectedRows === 1) {
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
      const decodedToken = await Token.decodeToken(accessToken);
      const userId = decodedToken.id;
      const like = await movieStorage.checkUserMovieLike(movieid, userId);
      if (like) {
        const response = await movieStorage.removeMovieLike(movieid, userId);
        return response;
      } else {
        const response = await movieStorage.addMovieLike(movieid, userId);
        return response;
      }
    } catch (error) {
      return { success: false, msg: "좋아요 업데이트 movie.service 오류" };
    }
  }
}

module.exports = Movie;
