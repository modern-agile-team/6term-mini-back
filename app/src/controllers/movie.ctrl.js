"use strict";

const Movie = require("../models/movie/movie.service");

const output = {
  getmovie: async (req, res) => {
    try {
      const movie = new Movie();
      const data = await movie.getmovie();

      //   res.render("home/mini", { data });
      res.json(data);
    } catch (error) {
      console.log(error);
      return res.json({ success: false, msg: "ctrl.js 오류" });
    }
  },
};

module.exports = { output };
