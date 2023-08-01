"use strict";

const Token = require("../models/Token/Token");

// 리프레시 토큰 저장
async function saveRefreshToken(req, res) {
  const refreshToken = req.headers.refreshtoken;

  try {
    const saveRefreshToken = await Token.saveRefreshToken(refreshToken);
    return res.status(200).json(saveRefreshToken);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: "리프레시 토큰 저장 에러" });
  }
}

module.exports = {
  saveRefreshToken,
};