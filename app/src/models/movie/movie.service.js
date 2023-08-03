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

  async updatemovielike(movieid, accessToken) {
    try {
      const decodedToken = await Token.decodeToken(accessToken);
      const userId = decodedToken.id;
      const like = await movieStorage.checkUserMovieLike(movieid, userId);
      if (like) {
        const response = await movieStorage.removeMovieLike(movieid, userId);
        return { success: true, msg: "좋아요를 취소했습니다."};
      } else {
        const response = await movieStorage.addMovieLike(movieid, userId);
        return { success: true, msg: "좋아요를 눌렀습니다."};
      }
    } catch (error) {
      return { success: false, msg: "좋아요 업데이트 movie.service 오류" };
    }
  }
}

module.exports = Movie;
