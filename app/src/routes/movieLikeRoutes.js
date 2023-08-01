"use scrict";

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/movielike.ctrl");

router.get("/get-movie-like", ctrl.output.getmovielike);
router.patch("/update-movie-like/:movie_id", ctrl.process.updatemovielike);

module.exports = router;
