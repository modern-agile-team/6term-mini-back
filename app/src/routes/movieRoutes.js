"use scrict";

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/movie.ctrl");
const identifyToken = require("../middlewares/identifyToken");

router.patch(
  // 로그인 id 가 토큰으로 발급되서 토큰에서 가져와야함.
  "/like/:movie_id",
  identifyToken.check.token,
  ctrl.process.updatemovielike
); // 영화 좋아요 업데이트

module.exports = router;
