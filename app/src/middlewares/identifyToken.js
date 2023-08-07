"use strict";

const Token = require("../models/Token/Token");
require("dotenv").config(); // 환경 변수를 .env 파일에서 가져오기
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY; // 환경 변수에서 시크릿 키 가져오기

const check = {
  token: async (req, res, next) => {
    try {
      const token = req.headers.accesstoken;
      if (!token) {
        return res.status(401).json({
          success: false,
          msg: "토큰이 없습니다."
        });
      }
      jwt.verify(token, secretKey);
      return next();

    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          msg: "토큰이 만료되었습니다."
        });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          msg: "토큰이 유효하지 않습니다."
        });
      }
    }
  },

  newToken: async (req, res) => {
    try {
      const refreshToken = req.headers.refreshtoken;
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          msg: "토큰이 없습니다."
        });
      }
      const response = await Token.checkRefreshToken(refreshToken);
      if (!response.success) {
        return res.status(401).json(response);
      }

      return res.status(200).json(response);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "토큰 갱신 에러" });
    }
  },
}

module.exports = { check, };