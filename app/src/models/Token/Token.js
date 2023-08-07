"use strict";

const UserStorage = require("../user/UserStorage");
const Auth = require("../Auth/Auth");
require("dotenv").config(); // 환경 변수를 .env 파일에서 가져오기
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY; // 환경 변수에서 시크릿 키 가져오기

class Token {
  // 토큰 디코딩
  static async decodeToken(token) {
    return jwt.decode(token).id;
  }

  // 리프레시 토큰 저장
  static async saveRefreshToken(refreshToken) {
    return UserStorage.saveRefreshToken(refreshToken);
  }

  // 리프레시 토큰 체크
  static async checkRefreshToken(refreshToken) {
    const decodedRefreshToken = jwt.verify(refreshToken, secretKey);
    if (!decodedRefreshToken) {
      return { success: false, msg: "리프레시 토큰이 만료되었습니다." };
    }

    const check = await UserStorage.checkRefreshToken(refreshToken);

    if (check.success) {
      const userInfo = jwt.decode(refreshToken);
      const newAccessToken = await Auth.crateAccessToken(userInfo);

      return {
        success: true,
        msg: "토큰이 갱신되었습니다.",
        accessToken: newAccessToken
      };
    } else {
      return { success: false, msg: "토큰이 만료되었습니다." };
    }
  }
}

module.exports = Token;