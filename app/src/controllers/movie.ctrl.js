"use strict";

const Movielike = require("../models/movie/movie.service");

const output = {
  getmovielike: async (req, res) => {
    try {
      const movielike = new Movielike();
      const data = await movielike.getmovielike();

      res.json(data);
    } catch (error) {
      console.log(error);
      return res.json({ success: false, msg: "ctrl.js 오류" });
    }
  },
};
const process = {
  updatemovielike: async (req, res) => {
    try {
      const movieId = req.params.movie_id;
      const accessToken = req.headers.accesstoken;

      const movielike = new Movielike();
      const response = await movielike.updatemovielike(movieId, accessToken);

      res.json(response);
    } catch (error) {
      console.log(error);
      return res.json({ success: false, msg: "movielike.ctrl 오류" });
    }
  },
};

module.exports = { output, process };
