"user strict";

const db = require("../../config/db");

class UserStorage {
  // 로그인
  static async login(loginId) {
    try {
      const sql = "SELECT * FROM user WHERE login_id = ?;";
      const data = (await db.query(sql, [loginId]))[0][0];
      if (!data) return false;
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // 로그아웃
  static async logout(refreshToken) {
    try {
      const sql = "DELETE FROM token WHERE refresh_token = ?;";
      const data = (await db.query(sql, [refreshToken]))[0];

      if (!data.affectedRows) return { success: false, msg: "refreshToken is not valid" };
      return { success: true, msg: "로그아웃 완료" };
    } catch (error) {
      console.error(error);
      return { success: false, msg: "로그아웃 에러" };
    }
  }

  // 회원가입
  static async register(loginId, email, pw) {
    try {
      const sql = "INSERT INTO user (login_id, email, pw) VALUES (?, ?, ?);";
      await db.query(sql, [loginId, email, pw]);
      return { success: true, msg: "회원가입 완료" };
    } catch (error) {
      console.error(error);
      return { success: false, msg: "회원가입 에러" };
    }
  }

  // 회원탈퇴
  static async deleteAccount(id) {
    try {
      const sql = "DELETE FROM user WHERE id = ?;";
      const data = (await db.query(sql, [id]))[0];
      if (!data.affectedRows) return { success: false, msg: "존재하지 않는 계정입니다." };
      return { success: true, msg: "계정 삭제 완료" };
    } catch (error) {
      console.error(error);
      return { success: false, msg: "계정 삭제 에러" };
    }
  }

  // 아이디 중복 검사
  static async checkUserLoginId(loginId) {
    try {
      const sql = "SELECT EXISTS (SELECT * FROM user WHERE login_id = ?) AS success;";
      return (await db.query(sql, [loginId]))[0][0].success;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // 이메일 중복 검사
  static async checkUserEmail(email) {
    try {
      const sql = "SELECT EXISTS (SELECT * FROM user WHERE email = ?) AS success;";
      return (await db.query(sql, [email]))[0][0].success;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // 아이디 찾기
  static async findLoginId(email) {
    try {
      const sql = "SELECT login_id FROM user WHERE email = ?;";
      const data = (await db.query(sql, [email]))[0][0].login_id;
      
      if (!data) return false;
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // 비밀번호 찾기
  static async findPw(loginId, email) {
    try {
      const sql = "SELECT pw FROM user WHERE login_id = ? AND email = ?;";
      return (await db.query(sql, [loginId, email]))[0][0].pw;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // 프로필 정보 가져오기
  static async getProfile(id) {
    try {
      const sql = "SELECT login_id AS loginId, email FROM user WHERE id = ?;"; // id로 로그인 아이디와 이메일을 가져옴
      return (await db.query(sql, [id]))[0][0];
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // 리프레시 토큰 저장
  static async saveRefreshToken(refreshToken) {
    try {
      const sql = "INSERT INTO token (refresh_token) VALUES (?);";
      await db.query(sql, [refreshToken]);
      return { success: true, msg: "리프레시 토큰 저장 완료" };
    } catch (error) {
      console.error(error);
      return { success: false, msg: "리프레시 토큰 저장 에러" };
    }
  }

  // 리프레시 토큰 체크
  static async checkRefreshToken(refreshToken) {
    try {
      const sql = "SELECT * FROM token WHERE refresh_token = ?;";
      const data = (await db.query(sql, [refreshToken]))[0][0];
      if (data.id) return { success: true, msg: "리프레시 토큰 검증 완료" };
      return { success: false, msg: "refreshToken is not valid" };
    } catch (error) {
      console.error(error);
      return { success: false, msg: "리프레시 토큰 검증 에러" };
    }
  }
}

module.exports = UserStorage;
