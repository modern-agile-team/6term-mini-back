"use strict";

const movieStorage = require("./movie.storage");

class Movie {
  async getmovielike() {
    try {
      return await movieStorage.getMovielike();
    } catch (error) {
      return { sucess: false, msg: "movielike.service 오류" };
    }
  }

  async updatemovielike(movieid, userid) {
    try {
      const like = await movieStorage.checkUserMovieLike(movieid, userid);
      if (like) {
        const response = await movieStorage.removeMovieLike(movieid, userid);
        return response;
      } else {
        const response = await movieStorage.addMovieLike(movieid, userid);
        return response;
      }
    } catch (error) {
      return { success: false, msg: "movielike.service 오류" };
    }
  }
}

module.exports = Movie;
