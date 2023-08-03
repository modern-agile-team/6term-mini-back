"use scrict";

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/movie.ctrl");

router.get("/lists", ctrl.output.getmovie);

module.exports = router;
