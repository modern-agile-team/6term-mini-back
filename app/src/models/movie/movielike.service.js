"use strict";

const movielikeStorage = require("./movielike.storage");

class Movielike {
  async getmovielike() {
    try {
      return await movielikeStorage.getMovielike();
    } catch (error) {
      return { sucess: false, msg: "movielike.service 오류" };
    }
  }

  async updatemovielike(movieid, userid) {
    try {
      const like = await movielikeStorage.checkUserMovieLike(movieid, userid);
      if (like) {
        const response = await movielikeStorage.removeMovieLike(
          movieid,
          userid
        );
        return response;
      } else {
        const response = await movielikeStorage.addMovieLike(movieid, userid);
        return response;
      }
    } catch (error) {
      return { success: false, msg: "movielike.service 오류" };
    }
  }
}

module.exports = Movielike;
