"use scrict";

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/movie.ctrl");
const identifyToken = require("../middlewares/identifyToken");

router.get("/lists", identifyToken.check.token, ctrl.output.getmovie); // 영화 목록

module.exports = router;
