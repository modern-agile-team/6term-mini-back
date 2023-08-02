"use scrict";

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/movie.ctrl");
const identifyToken = require("../middlewares/identifyToken");

router.get("/lists", identifyToken.check.token, ctrl.output.getmovie); // 영화 목록
router.get("/seats", identifyToken.check.token, ctrl.output.getSeat); // 좌석 조회
router.get("/myseats", identifyToken.check.token, ctrl.output.getUserSeat); // 예매된 유저 좌석 조회

router.post("/seats", identifyToken.check.token, ctrl.intput.reserveSeat); // 좌석 예매

router.delete("/users/seat", identifyToken.check.token, ctrl.intput.cancelSeat); // 예매 취소

module.exports = router;
