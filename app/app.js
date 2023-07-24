"use strict";

const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./src/routes/authRoutes");
const dotenv = require("dotenv");
dotenv.config();

// 미들웨어 등록 및 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 설정
app.use(cors());

// 라우터 연결
app.use("/auth", authRoutes);


module.exports = app;