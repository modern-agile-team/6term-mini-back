"use strict";

const User = require('../models/user/User.service');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config(); // 환경 변수를 .env 파일에서 가져오기
const secretKey = process.env.JWT_SECRET_KEY; // 환경 변수에서 시크릿 키 가져오기
const accessTokenExpiresIn = "5m"; // 액세스 토큰 만료 시간
const refreshTokenExpiresIn = "24h"; // 리프레시 토큰 만료 시간
const allowedCharactersRegex = /^[A-Za-z0-9!@#$%^&*()_+={}[\]:;"'<>,.?/~`|-]+$/; // 허용되는 문자열 정규식

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 로그인
async function login(req, res) {
  const { loginId, pw } = req.body; // 로그인 요청에서 아이디와 비밀번호 가져오기

  if (!isInputValid(loginId, pw)) {
    return res.status(401).json({ error: "아이디와 비밀번호를 모두 입력해주세요." });
  }

  try {
    const nUser = new User();
    const user = await nUser.login(loginId, pw); // 유저 정보 가져오기

    if (!user) { // 유저가 없으면
      return res.status(401).json({ error: "존재하지 않는 아이디 입니다." });
    }

    const passwordMatch = pw === user.pw; // 비밀번호 비교
    if (!passwordMatch) {
      return res.status(401).json({ error: "비밀번호가 틀렸습니다." });
    }
    const accessTokenPayload = { id: user.id };
    const refreshTokenPayload = { id: user.id, refreshToken: true };

    const accessToken = jwt.sign(accessTokenPayload, secretKey, { expiresIn: accessTokenExpiresIn }); // 액세스 토큰 발급
    const refreshToken = jwt.sign(refreshTokenPayload, secretKey, { expiresIn: refreshTokenExpiresIn }); // 리프레시 토큰 발급

    // 리프레시 토큰 DB에 저장
    const saveRefreshTokenResponse = await nUser.saveRefreshToken(refreshToken);
    if (!saveRefreshTokenResponse.success) {
      return res.status(401).json({ error: "리프레시 토큰 저장 오류" });
    }

    res.json({
      msg: "로그인 성공, 토큰이 발급되었습니다!",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

  } catch (error) { // 에러 처리
    console.error(error);
    res.status(500).json({ error: "로그인 오류" });
  }
}

// 로그아웃
async function logout(req, res) {
  const refreshToken = req.headers.refreshtoken; // 로그아웃 요청에서 리프레시 토큰 가져오기

  try {
    const nUser = new User();
    const response = await nUser.logout(refreshToken); // 로그아웃
    if (!response.success) { // 로그아웃 실패
      res.status(401).json({ error: response.msg });
    } else {
      res.status(200).json({ response }); // 로그아웃 성공
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "로그아웃 오류" });
  }
}

// 회원가입
async function register(req, res) {
  const { loginId, email, pw } = req.body; // 회원가입 요청에서 아이디, 이메일, 비밀번호 가져오기

  if (!isValidEmail(email)) {
    return res.status(401).json({ error: "이메일 형식이 올바르지 않습니다." });
  }

  if (isInputValid(loginId, email, pw).success === false) {
    return res.status(401).json({ error: `${isInputValid(loginId, email, pw).msg} 을(를) 입력해주세요.` });
  }

  if (isInputValidChar(loginId, email, pw).success === false) {
    return res.status(401).json({ error: `${isInputValidChar(loginId, email, pw).msg}에 허용되지 않는 문자열이 포함되어 있습니다.` });
  }

  try {
    const nUser = new User();
    const response = await nUser.register(loginId, email, pw); // 회원가입
    if (!response.success) { // 회원가입 실패
      res.status(401).json({ error: response.msg });
    } else {
      res.status(200).json({ response }); // 회원가입 성공
    }
  } catch (error) { // 에러 처리
    console.error(error);
    res.status(500).json({ error: "회원가입 오류" });
  }
}

// 계정 삭제
async function deleteAccount(req, res) {
  const accessToken = req.headers.accesstoken; // 회원탈퇴 요청에서 액세스 토큰 가져오기
  const decodedAccessToken = decodeJWT(accessToken); // 액세스 토큰 디코딩
  const id = decodedAccessToken.id; // 디코딩된 액세스 토큰에서 아이디 가져오기

  try {
    const nUser = new User();
    const response = await nUser.deleteAccount(id); // 회원탈퇴
    if (!response.success) { // 회원탈퇴 실패
      res.status(401).json({ error: response.msg });
    } else {
      res.status(200).json({ response }); // 회원탈퇴 성공
    }
  } catch (error) { // 에러 처리
    console.error(error);
    res.status(500).json({ error: "회원탈퇴 오류" });
  }
}

// 아이디 중복
async function checkUserLoginId(req, res) {
  try {
    const user = new User();
    const { loginId } = req.body;
    const userExists = await user.checkUserLoginId(loginId);

    if (userExists) {
      res.status(401).json(false);
    } else {
      res.status(200).json(true);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "아이디 중복 검사 오류" });
  }
}

// 이메일 중복
async function checkUserEmail(req, res) {
  try {
    const user = new User();
    const { email } = req.body;
    const emailExists = await user.checkUserEmail(email);

    if (emailExists) {
      res.status(401).json(false);
    } else {
      res.status(200).json(true);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "이메일 중복 검사 오류" });
  }
}

// 아이디 찾기
async function findLoginId(req, res) {
  try {
    const user = new User();
    const { email } = req.body;
    const loginId = await user.findLoginId(email);

    if (loginId) {
      const mailOptions = { // 메일 옵션
        from: process.env.EMAIL_USER, // 발송 메일 주소
        to: email, // 수신 메일 주소
        subject: "혼영관 아이디 찾기 요청으로 발신된 이메일입니다.", // 제목
        text: `혼영관에 ${email} (으)로 가입하신 계정의 아이디는 ${loginId} 입니다.\n외부에 유출되지 않도록 주의해주세요!`, // 내용
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          res.status(500).json({ error: "이메일 발송 오류" });
        } else {
          console.log("Email sent:", info.response);
        }
      });
      res.status(200).json({ msg: "아이디를 이메일로 발송하였습니다."})
    } else {
      res.status(401).json({ error: "존재하지 않는 이메일입니다." });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "아이디 찾기 오류" });
  }
}

// 비밀번호 찾기
async function findPw(req, res) {
  try {
    const user = new User();
    const { loginId, email } = req.body;
    const pw = await user.findPw(loginId, email);

    if (pw) {
      const mailOptions = { // 메일 옵션
        from: process.env.EMAIL_USER, // 발송 메일 주소
        to: email, // 수신 메일 주소
        subject: "혼영관 비밀번호 찾기 요청으로 발신된 이메일입니다.", // 제목
        text: `혼영관에 ${loginId} (으)로 가입하신 계정의 비밀번호는 ${pw} 입니다.\n외부에 유출되지 않도록 주의해주세요!`, // 내용
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          res.status(500).json({ error: "이메일 발송 오류" });
        } else {
          console.log("Email sent:", info.response);
        }
      });
      res.status(200).json({ msg: "비밀번호를 이메일로 발송하였습니다."})
    } else {
      res.status(401).json({ error: "아이디 혹은 이메일이 일치하지 않습니다." });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "비밀번호 찾기 오류" });
  }
}

// 토큰 검증
async function checkToken(req, res, next) {
  try {
    const token = req.headers.accesstoken; // Authorization 헤더에서 토큰 가져오기

    if (!token) {
      return res.status(401).json({ error: "토큰이 제공되지 않았습니다" });
    }

    const decoded = jwt.verify(token, secretKey); // 토큰 확인
    if (decoded) { // 토큰이 유효하면
      res.status(200).json({ msg: "토큰이 유효합니다" });
      return next();
    } else {
      return res.status(401).json({ error: "유효하지 않은 토큰입니다" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // 액세스 토큰이 만료되었을 때 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급
      try {
        const refreshToken = req.headers.refreshtoken;

        if (!refreshToken) {
          return res.status(401).json({ error: "토큰이 만료되었습니다" });
        }

        const decodedRefreshToken = jwt.verify(refreshToken, secretKey);

        if (!decodedRefreshToken.refreshToken) {
          return res.status(401).json({ error: "유효하지 않은 리프레시 토큰입니다" });
        }

        // 리프레쉬 토큰 비교
        const nUser = new User();
        const refreshTokenExists = await nUser.checkRefreshToken(refreshToken);

        if (refreshTokenExists.success) {
          const newAccessTokenPayload = { id: decodedRefreshToken.id };
          const newAccessToken = jwt.sign(newAccessTokenPayload, secretKey, { expiresIn: accessTokenExpiresIn });

          return res.status(200).json({
            msg: "액세스 토큰이 갱신되었습니다!",
            accessToken: newAccessToken,
          });
        }
      } catch (refreshError) {
        console.error(refreshError);
        return res.status(500).json({ error: "리프레시 토큰 검증 또는 발급 오류" });
      }
    }
    return res.status(500).json({ error: "잘못된 토큰입니다" });
  }
}

// 프로필 정보 가져오기
async function getProfile(req, res) {
  const accessToken = req.headers.accesstoken; // 프로필 정보 요청에서 액세스 토큰 가져오기
  if (!accessToken) {
    return res.status(401).json({ error: "토큰이 제공되지 않았습니다" });
  }
  const decodedAccessToken = decodeJWT(accessToken); // 액세스 토큰 디코딩
  if (!decodedAccessToken) {
    return res.status(401).json({ error: "유효하지 않은 토큰입니다" });
  }
  const id = decodedAccessToken.id; // 디코딩된 액세스 토큰에서 아이디 가져오기

  try {
    const nUser = new User();
    const response = await nUser.getProfile(id); // 프로필 정보 가져오기

    if (response.success === false) {
      res.status(401).json({ error: response.error });
    } else {
      res.status(200).json({ response });
    }
  } catch (error) { // 에러 처리
    console.error(error);
    res.status(500).json({ error: "프로필 정보 가져오기 오류" });
  }
}

// DB로 refreshtoken을 저장
async function saveRefreshToken(req, res) {
  const refreshToken = req.headers.refreshtoken;

  try {
    const nUser = new User();
    const response = await nUser.saveRefreshToken(refreshToken);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "리프레시 토큰 저장 오류" });
  }
}

// DB에서 refreshtoken을 검증
async function checkRefreshToken(req, res) {
  const refreshToken = req.headers.refreshtoken;
  try {
    const nUser = new User();
    const response = await nUser.checkRefreshToken(refreshToken);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "리프레시 토큰 검증 오류" });
  }
}

// 공백, 빈칸 검사
function isInputValid(loginId, email, pw) {
  if (!loginId) return { success: false, msg: "아이디" };
  if (!email) return { success: false, msg: "이메일" };
  if (!pw) return { success: false, msg: "비밀번호" };
  return true;
}

// 허용되지 않는 문자열 검사
function isInputValidChar(loginId, email, pw) {
  if (!allowedCharactersRegex.test(loginId)) return { success: false, msg: "아이디" };
  if (!allowedCharactersRegex.test(email)) return { success: false, msg: "이메일" };
  if (!allowedCharactersRegex.test(pw)) return { success: false, msg: "비밀번호" };
  return true;
}

// JWT 디코딩
function decodeJWT(token) {
  try {
    return jwt.decode(token, { complete: true }); // 토큰 디코딩
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// 이메일 유효성 검사
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = { login, logout, register, deleteAccount, checkUserLoginId,checkUserEmail,findLoginId, findPw, checkToken, getProfile, saveRefreshToken, checkRefreshToken };
