"use strict";

const Movie = require("../models/movie/movie.service");

const output = {
  getmovielike: async (req, res) => {
    try {
      const movielike = new Movie();
      const data = await movielike.getmovielike();

      //   res.render("home/mini", { data });
      res.json(data);
    } catch (error) {
      console.log(error);
      return res.json({ success: false, msg: "ctrl.js 오류" });
    }
  },
  getmovie: async (req, res) => {
    try {
      const movie = new Movie();
      const data = await movie.getmovie();
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.json({ success: false, msg: "ctrl.js 오류" });
    }
  },

  getSeat: async (req, res) => {
    try {
      const movie = new Movie();
      const response = await movie.getSeat();
      return res.json(response);
    } catch (error) {
      console.log(error);
      return res.json({ success: false, msg: "좌석 조회 ctrl.js 오류" });
    }
  },

  getUserSeat: async (req, res) => {
    const accessToken = req.headers.accesstoken;

    try {
      const movie = new Movie();
      const response = await movie.getUserSeat(accessToken);
      return res.json(response);
    } catch (error) {
      console.log(error);
      return res.json({ success: false, msg: "유저 좌석 조회 ctrl.js 오류" });
    }
  },
};

const intput = {
  reserveSeat: async (req, res) => {
    const accessToken = req.headers.accesstoken;
    const { movieId, seatRow, seatCol, seatDate } = req.body;

    try {
      const movie = new Movie();
      const response = await movie.reserveSeat(
        accessToken,
        movieId,
        seatRow,
        seatCol,
        seatDate
      );
      return res.json(response);
    } catch (error) {
      console.log(error);
      return res.json({ success: false, msg: "좌석 예매 ctrl.js 오류" });
    }
  },

  cancelSeat: async (req, res) => {
    const { id } = req.body;
    try {
      const movie = new Movie();
      const response = await movie.cancelSeat(id);
      return res.json(response);
    } catch (error) {
      console.log(error);
      return res.json({ success: false, msg: "좌석 취소 ctrl.js 오류" });
    }
  },
};

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

module.exports = { output, intput, process };
