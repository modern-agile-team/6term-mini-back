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
        const refreshToken = req.headers.refreshtoken;
        if (!refreshToken) {
          return res.status(401).json({
            success: false,
            msg: "리프레시 토큰이 없습니다."
          });
        }
        const result = await Token.checkRefreshToken(refreshToken);
        if (result.success) {
          req.accesstoken = result.accessToken;
          return next();
        } else {
          return res.status(401).json(result);
        }
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          msg: "토큰이 유효하지 않습니다."
        });
      }
    }
  },
}

module.exports = { check, };