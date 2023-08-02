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

  async updatemovielike(movieId, accessToken) {
    try {
      const decodedToken = await Token.decodeToken(accessToken);
      const userId = decodedToken.id;
      const like = await movieStorage.checkUserMovieLike(movieId, userId);
      if (like) {
        const response = await movieStorage.removeMovieLike(movieId, userId);
        return response;
      } else {
        const response = await movieStorage.addMovieLike(movieId, userId);
        return response;
      }
    } catch (error) {
      return { success: false, msg: "movielike.service 오류" };
    }
  }
}

module.exports = Movie;
