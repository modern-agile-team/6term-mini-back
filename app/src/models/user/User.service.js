"user strict";

const UserStorage = require("./UserStorage");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // 환경 변수를 .env 파일에서 가져오기
const secretKey = process.env.JWT_SECRET_KEY; // 환경 변수에서 시크릿 키 가져오기
const accessTokenExpiresIn = "5m"; // 액세스 토큰 만료 시간
const refreshTokenExpiresIn = "7d"; // 리프레시 토큰 만료 시간

class User {
  constructor(body) {
    this.body = new UserStorage(body);
  }

  async login(loginId, pw) {
    try {
      const userInfo = await this.body.login(loginId, pw);
      // if (!userInfo) {
      //   return { success: false, msg: "존재하지 않는 아이디입니다." };
      // }
      // if (pw !== userInfo.pw) {
      //   return { success: false, msg: "비밀번호가 틀렸습니다." };
      // }

      // const accessTokenPayload = { login_id: userInfo.login_id };
      // const refreshTokenPayload = { login_id: userInfo.login_id, refresh_token: true };

      // const accessToken = jwt.sign(accessTokenPayload, secretKey, { expiresIn: accessTokenExpiresIn }); // 액세스 토큰 발급
      // const refreshToken = jwt.sign(refreshTokenPayload, secretKey, { expiresIn: refreshTokenExpiresIn }); // 리프레시 토큰 발급

      return userInfo;
    } catch (err) {
      return { success: false, msg: "로그인 에러" };
    }
  }

  async register(loginId, email, pw) {
    try {
      const userExists = await this.checkUserLoginId(loginId);
      if (userExists) {
        return { success: false, msg: "이미 존재하는 아이디입니다." };
      }

      if (email) {
        const emailExists = await this.checkUserEmail(email);
        if (emailExists) {
          return { success: false, msg: "이미 존재하는 이메일입니다." };
        }
      }

      const response = await this.body.register(loginId, email, pw);
      if (!response.success) {
        return { success: false, msg: response.msg };
      }

      return response;
    } catch (err) {
      return { success: false, msg: "회원가입 에러" };
    }
  }

  async checkUserLoginId(loginId) {
    try {
      const response = await this.body.checkUserLoginId(loginId);
      return response;
    } catch (err) {
      return { success: false, msg: "유저 존재 여부 확인 에러" };
    }
  }

  async checkUserEmail(email) {
    try {
      const response = await this.body.checkUserEmail(email);
      return response;
    } catch (err) {
      return { success: false, msg: "이메일 존재 여부 확인 에러" };
    }
  }

  async findLoginId(email) {
    try {
      const response = await this.body.findLoginId(email);
      return response;
    } catch (err) {
      return { success: false, msg: "아이디 찾기 에러" };
    }
  }

  async saveRefreshToken(refreshToken) {
    try {
      const response = await this.body.saveRefreshToken(refreshToken);
      return response;
    } catch (err) {
      return { success: false, msg: "리프레시 토큰 저장 에러" };
    }
  }

  async checkRefreshToken(refreshToken) {
    try {
      const response = await this.body.checkRefreshToken(refreshToken);
      return response;
    } catch (err) {
      return { success: false, msg: "리프레시 토큰 검증 에러" };
    }
  }
}

module.exports = User;
