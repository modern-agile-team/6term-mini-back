"use strict";

const express = require("express");
const app = express();
const authRoutes = require("./src/routes/authRoutes");
const dotenv = require("dotenv");
dotenv.config();

// 미들웨어 등록 및 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 연결
app.use("/", authRoutes);

module.exports = app;