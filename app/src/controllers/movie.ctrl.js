"use strict";

const Movie = require("../models/movie/movie.service");

const process = {
  updatemovielike: async (req, res) => {
    try {
      const movieId = req.params.movie_id;
      const accessToken = req.headers.accesstoken;

      const movielike = new Movie();
      const response = await movielike.updatemovielike(movieId, accessToken);

      res.json(response);
    } catch (error) {
      console.log(error);
      return res.json({ success: false, msg: "movielike.ctrl 오류" });
    }
  },
};

module.exports = { process };