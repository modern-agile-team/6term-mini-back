"use strict";

const movieStorage = require("./movie.storage");

class Movie {
  async getMovie() {
    try {
      const movieInfo = await movieStorage.getMovie();
      return { sucess: true, msg: "영화 조회 성공", movieInfo };
    } catch (error) {
      console.log(error);
      return { sucess: false, msg: "movie.js 오류" };
    }
  }
}

module.exports = Movie;
