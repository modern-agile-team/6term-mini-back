"use strict";

const User = require('../models/user/User.service');

const sign = {
  // 로그인
  login: async (req, res) => {
    const { loginId, pw } = req.body; // 로그인 요청에서 아이디와 비밀번호 가져오기

    try {
      const user = new User();
      const response = await user.login(loginId, pw); // 유저 정보 가져오기
      if (!response.success) {
        return res.status(401).json(response);
      }
      return res.status(200).json(response);

    } catch (error) { // 에러 처리
      console.error(error);
      res.status(500).json({ error: "로그인 오류" });
    }
  },

  // 로그아웃
  logout: async (req, res) => {
    const refreshToken = req.headers.refreshtoken; // 로그아웃 요청에서 리프레시 토큰 가져오기

    try {
      const user = new User();
      const response = await user.logout(refreshToken); // 로그아웃
      return res.status(200).json(response);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "로그아웃 오류" });
    }
  },

  // 회원가입
  register: async (req, res) => {
    const { loginId, email, pw } = req.body; // 회원가입 요청에서 아이디, 이메일, 비밀번호 가져오기

    try {
      const user = new User();
      const response = await user.register(loginId, email, pw); // 회원가입
      return res.status(200).json(response);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "회원가입 오류" });
    }
  },

  // 회원탈퇴
  deleteAccount: async (req, res) => {
    const accesstoken = req.headers.accesstoken; // 회원탈퇴 요청에서 아이디 가져오기

    try {
      const user = new User();
      const response = await user.deleteAccount(accesstoken); // 회원탈퇴
      return res.status(200).json(response);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "회원탈퇴 오류" });
    }
  },
}

const check = {
  // 아이디 중복 검사
  checkUserLoginId: async (req, res) => {
    const { loginId } = req.body;

    try {
      const user = new User();
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
  },

  // 이메일 중복 검사
  checkUserEmail: async (req, res) => {
    const { email } = req.body;

    try {
      const user = new User();
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
  },

  // 아이디 찾기
  findLoginId: async (req, res) => {
    const { email } = req.body;
    
    try {
      const user = new User();
      const response = await user.findLoginId(email);
      if (response.success) {
        return res.status(200).json({ success: true, msg: response.msg });
      } else {
        return res.status(401).json({ success: false, msg: response.msg });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "아이디 찾기 오류" });
    }
  },

  // 비밀번호 찾기
  findPw: async (req, res) => {
    const { loginId, email } = req.body;
    try {
      const user = new User();
      const response = await user.findPw(loginId, email);
      if (response.success) {
        return res.status(200).json({ success: true, msg: response.msg });
      } else {
        return res.status(401).json({ success: false, msg: response.msg });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "비밀번호 찾기 오류" });
    }
  },

  // 프로필 정보 가져오기
  getProfile: async (req, res) => {
    const accesstoken = req.headers.accesstoken; // 프로필 정보 요청에서 액세스 토큰 가져오기

    try {
      const user = new User();
      const response = await user.getProfile(accesstoken); // 프로필 정보 가져오기
      return res.status(200).json(response);
      
    } catch (error) { // 에러 처리
      console.error(error);
      res.status(500).json({ error: "프로필 정보 가져오기 오류" });
    }
  },
}

module.exports = {
  sign,
  check,
};
