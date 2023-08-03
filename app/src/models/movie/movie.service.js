"use strict";

const movieStorage = require("./movie.storage");

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
}

module.exports = Movie;
