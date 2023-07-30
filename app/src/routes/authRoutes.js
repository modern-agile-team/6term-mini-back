"user strict";

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const identifyToken = require('../middlewares/identifyToken');
const tokenController = require('../controllers/tokenController');

router.post('/login', authController.login); // 로그인, 토큰 발급
router.post('/register', authController.register); // 회원가입

router.post('/users/id', authController.checkUserLoginId); // 아이디 중복 확인
router.post('/users/email', authController.checkUserEmail); // 이메일 중복 확인

router.get('/id', authController.findLoginId); // 아이디 찾기
router.get('/pw', authController.findPw); // 비밀번호 찾기

router.delete( // 로그아웃 (DB 리프레시 토큰 삭제)
  '/logout',
  identifyToken.check.token,
  authController.logout
);

router.delete( // 회원 탈퇴
  '/users',
  identifyToken.check.token,
  authController.deleteAccount
);

router.get( // 프로필 정보 가져오기
  '/users/profile',
  identifyToken.check.token,
  authController.getProfile
);

router.post( // 리프레시 토큰 DB에 저장
  '/token',
  identifyToken.check.token,
  tokenController.saveRefreshToken
);

module.exports = router;
