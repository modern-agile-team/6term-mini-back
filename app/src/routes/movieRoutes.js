"use scrict";

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/movie.ctrl");
const identifyToken = require("../middlewares/identifyToken");

router.get("/movies", identifyToken.check.token, ctrl.output.getmovie); // 영화 목록
router.get("/movies/seat", identifyToken.check.token, ctrl.output.getSeat); // 좌석 조회

router.post("/movies/seat", identifyToken.check.token, ctrl.intput.reserveSeat); // 좌석 예매

module.exports = router;
