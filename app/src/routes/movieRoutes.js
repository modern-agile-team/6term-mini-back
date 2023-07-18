"use scrict";

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/movie.ctrl");

router.get("/get-movie", ctrl.output.getmovie);

module.exports = router;
