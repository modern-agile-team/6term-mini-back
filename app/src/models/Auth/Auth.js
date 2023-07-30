"use strict";

require("dotenv").config(); // 환경 변수를 .env 파일에서 가져오기
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY; // 환경 변수에서 시크릿 키 가져오기

class Auth {
  static async crateAccessToken(userInfo) {
    const payload = {
      id: userInfo.id,
      tokenType: "accessToken"
    };
    return jwt.sign(payload, secretKey, { expiresIn: "15m" }); // 액세스 토큰 발급
  }

  static async crateRefreshToken(userInfo) {
    const payload = {
      id: userInfo.id,
      tokenType: "refreshToken"
    };
    return jwt.sign(payload, secretKey, { expiresIn: "24h" }); // 리프레시 토큰 발급
  }
}

module.exports = Auth;