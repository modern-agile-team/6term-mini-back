"use strict";

const movieStorage = require("./movie.storage");
const Token = require("../Token/Token");

class Movie {
  async updatemovielike(movieid, accessToken) {
    try {
      const userId = await Token.decodeToken(accessToken);
      const like = await movieStorage.checkUserMovieLike(movieid, userId);
      if (like) {
        await movieStorage.removeMovieLike(movieid, userId);
        return { success: true, msg: "좋아요를 취소했습니다." };
      } else {
        await movieStorage.addMovieLike(movieid, userId);
        return { success: true, msg: "좋아요를 눌렀습니다." };
      }
    } catch (error) {
      return { success: false, msg: "좋아요 업데이트 movie.service 오류" };
    }
  }
}

module.exports = Movie;
