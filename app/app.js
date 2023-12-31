"use strict";

const express = require("express");
const app = express();

const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const movieRoutes = require("./src/routes/movieRoutes");
const dotenv = require("dotenv");
dotenv.config();

// 미들웨어 등록 및 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 라우터 연결
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);

module.exports = app;
