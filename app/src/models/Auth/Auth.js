"use strict";

require("dotenv").config(); // 환경 변수를 .env 파일에서 가져오기
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY; // 환경 변수에서 시크릿 키 가져오기

class Auth {
  static async crateAccessToken(userInfo) {
    const user = await userInfo;
    const payload = {
      id: user.id,
      tokenType: "accessToken",
      exp: Math.floor(Date.now() / 1000) + 60 * 30,
    };
    return jwt.sign(payload, secretKey); // 액세스 토큰 발급
  }

  static async crateRefreshToken(userInfo) {
    const user = await userInfo;
    const payload = {
      id: user.id,
      tokenType: "refreshToken",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
    return jwt.sign(payload, secretKey); // 리프레시 토큰 발급
  }
}

module.exports = Auth;
