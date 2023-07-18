"use strict";

const movieStorage = require("./movie.storage");

class Movie {
  async getmovie() {
    try {
      return await movieStorage.getmovie();
    } catch (error) {
      return { sucess: false, msg: "movie.js 오류" };
    }
  }
}

module.exports = Movie;
