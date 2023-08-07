"user strict";

const UserStorage = require("./UserStorage");
const Auth = require("../Auth/Auth");
const Token = require("../Token/Token");
const Mail = require("../email/email");

class User {
  // 로그인
  async login(loginId, pw) {
    try {
      const userInfo = await UserStorage.login(loginId);

      if (!userInfo.id) {
        return { success: false, msg: "존재하지 않는 아이디입니다." };
      }

      if (pw !== userInfo.pw) {
        return { success: false, msg: "비밀번호가 틀렸습니다." };
      }

      const accessToken = await Auth.crateAccessToken(userInfo);
      const refreshToken = await Auth.crateRefreshToken(userInfo);

      this.saveRefreshToken(refreshToken); // 리프레시 토큰 저장

      return {
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken
      };
    } catch (err) {
      return { success: false, msg: "로그인 에러" };
    }
  }

  // 로그아웃
  async logout(refreshToken) {
    try {
      const deleteToken = await UserStorage.logout(refreshToken);
      if (!deleteToken.success) {
        return { success: false, msg: deleteToken.msg };
      }

      return deleteToken;
    } catch (err) {
      return { success: false, msg: "로그아웃 에러" };
    }
  }

  // 회원가입
  async register(loginId, email, pw) {
    try {
      const checkInputValidChar = this.checkInputValidChar(loginId, email, pw);
      if (!checkInputValidChar.success) {
        return { success: false, msg: `${checkInputValidChar.msg} 에 허용되지 않는 문자열이 포함되어 있습니다.` };
      }

      if (!this.checkEmailValid(email)) {
        return { success: false, msg: "이메일 형식이 올바르지 않습니다." };
      }

      const userExists = await UserStorage.checkUserLoginId(loginId);
      if (userExists) {
        return { success: false, msg: "이미 존재하는 아이디입니다." };
      }

      const emailExists = await UserStorage.checkUserEmail(email);
      if (emailExists) {
        return { success: false, msg: "이미 존재하는 이메일입니다." };
      }

      const register = await UserStorage.register(loginId, email, pw);
      if (!register.success) {
        return { success: false, msg: register.msg };
      }

      return register;
    } catch (err) {
      return { success: false, msg: "회원가입 에러" };
    }
  }

  // 회원탈퇴
  async deleteAccount(accesstoken) {
    try {
      const id = await Token.decodeToken(accesstoken);
      const deleteAccount = await UserStorage.deleteAccount(id);

      if (!deleteAccount.success) {
        return { success: false, msg: deleteAccount.msg };
      }
      return deleteAccount;
      
    } catch (err) {
      return { success: false, msg: "회원탈퇴 에러" };
    }
  }

  // 아이디 중복 검사
  async checkUserLoginId(loginId) {
    try {
      return await UserStorage.checkUserLoginId(loginId);
    } catch (err) {
      return { success: false, msg: "유저 존재 여부 확인 에러" };
    }
  }

  // 이메일 중복 검사
  async checkUserEmail(email) {
    try {
      return await UserStorage.checkUserEmail(email);
    } catch (err) {
      return { success: false, msg: "이메일 존재 여부 확인 에러" };
    }
  }

  // 아이디 찾기
  async findLoginId(email) {
    const loginId = await UserStorage.findLoginId(email);
    if (!loginId) {
      return { success: false, msg: "존재하지 않는 이메일입니다."};
    } else {
      const content = "아이디"
      await Mail.send(loginId, email, content);
      return { success: true, msg: "이메일 발송 성공" };
    }
  }

  // 비밀번호 찾기
  async findPw(loginId, email) {
    const pw = await UserStorage.findPw(loginId, email);
    if (!pw) {
      return { success: false, msg: "존재하지 않는 계정입니다."};
    } else {
      const content = "비밀번호"
      await Mail.send(pw, email, content);
      return { success: true, msg: "이메일 발송 성공" };
    }
  }

  // 프로필 정보 가져오기
  async getProfile(accesstoken) {
    try {
      const id = await Token.decodeToken(accesstoken);
      const profile = await UserStorage.getProfile(id);

      if (!profile) {
        return { success: false, msg: "프로필 정보 가져오기 실패" };
      }

      return profile;
    } catch (err) {
      return { success: false, msg: "프로필 정보 가져오기 에러" };
    }
  }

  // 리프레시 토큰 저장
  async saveRefreshToken(refreshToken) {
    try {
      return await Token.saveRefreshToken(refreshToken);
    } catch (error) {
      console.log(error);
      return { success: false, msg: "리프레시 토큰 저장 에러" };
    }
  }

  // 허용되지 않는 문자열 확인
  checkInputValidChar(loginId, email, pw) {
    const allowedCharactersRegex = /^[A-Za-z0-9!@#$%^&*()_+={}[\]:;"'<>,.?/~`|-]+$/; // 허용되는 문자열 정규식
    if (!allowedCharactersRegex.test(loginId)) {
      return { success: false, msg: "아이디" };
    }
    if (!allowedCharactersRegex.test(email)) {
      return { success: false, msg: "이메일" };
    }
    if (!allowedCharactersRegex.test(pw)) {
      return { success: false, msg: "비밀번호" };
    }
    return { success: true };
  }

  // 이메일 유효성 검사
  checkEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = User;
