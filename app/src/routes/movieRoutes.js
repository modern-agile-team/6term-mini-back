"use scrict";

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/movie.ctrl");

router.patch("/like/:movie_id", ctrl.process.updatemovielike);

module.exports = router;
