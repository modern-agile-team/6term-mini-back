"use strict";

const User = require('../models/user/User.service');
const jwt = require("jsonwebtoken");
require("dotenv").config(); // 환경 변수를 .env 파일에서 가져오기
const secretKey = process.env.JWT_SECRET_KEY; // 환경 변수에서 시크릿 키 가져오기
const accessTokenExpiresIn = "5m"; // 액세스 토큰 만료 시간
const refreshTokenExpiresIn = "7d"; // 리프레시 토큰 만료 시간

async function login(req, res) {
  const { login_id, pw } = req.body; // 로그인 요청에서 아이디와 비밀번호 가져오기

  try {
    const nUser = new User(req.body);
    const user = await nUser.login(login_id, pw); // 유저 정보 가져오기

    if (!user) { // 유저가 없으면
      return res.status(401).json({ error: "유저 없음" });
    }

    const passwordMatch = pw === user.pw; // 비밀번호 비교
    if (!passwordMatch) {
      return res.status(401).json({ error: "비밀번호가 틀렸습니다!" });
    }

    const accessTokenPayload = { login_id: user.login_id };
    const refreshTokenPayload = { login_id: user.login_id, refresh_token: true };

    const accessToken = jwt.sign(accessTokenPayload, secretKey, { expiresIn: accessTokenExpiresIn }); // 액세스 토큰 발급
    const refreshToken = jwt.sign(refreshTokenPayload, secretKey, { expiresIn: refreshTokenExpiresIn }); // 리프레시 토큰 발급

    res.json({
      msg: "로그인 성공, 토큰이 발급되었습니다!",
      access_token: accessToken,
      refresh_token: refreshToken,
    });

  } catch (error) { // 에러 처리
    console.error(error);
    res.status(500).json({ error: "로그인 오류" });
  }
}

function checkToken(req, res, next) {
  try {
    const token = req.headers.authorization; // Authorization 헤더에서 토큰 가져오기

    if (!token) {
      return res.status(401).json({ error: "토큰이 제공되지 않았습니다" });
    }

    const decoded = jwt.verify(token, secretKey); // 토큰 확인

    if (decoded) { // 토큰이 유효하면
      return res.status(200).json({ msg: "유효한 토큰입니다!" });
    } else {
      return res.status(401).json({ error: "유효하지 않은 토큰입니다" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // 액세스 토큰이 만료되었을 때 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급
      try {
        const refreshToken = req.headers.refresh_token;

        if (!refreshToken) {
          return res.status(401).json({ error: "토큰이 만료되었습니다" });
        }

        const decodedRefreshToken = jwt.verify(refreshToken, secretKey);

        if (!decodedRefreshToken.refresh_token) {
          return res.status(401).json({ error: "유효하지 않은 리프레시 토큰입니다" });
        }

        const newAccessTokenPayload = { login_id: decodedRefreshToken.login_id };
        const newAccessToken = jwt.sign(newAccessTokenPayload, secretKey, { expiresIn: accessTokenExpiresIn });

        return res.status(200).json({
          msg: "액세스 토큰이 갱신되었습니다!",
          access_token: newAccessToken,
        });
      } catch (refreshError) {
        console.error(refreshError);
        return res.status(500).json({ error: "리프레시 토큰 검증 또는 발급 오류" });
      }
    }

    return res.status(500).json({ error: "잘못된 토큰입니다" });
  }
}

module.exports = { login, checkToken };
