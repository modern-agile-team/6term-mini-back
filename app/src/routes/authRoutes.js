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

router.post('/id', authController.findLoginId); // 아이디 찾기
router.post('/pw', authController.findPw); // 비밀번호 찾기

router.delete('/logout', identifyToken.check.token, authController.logout); // 로그아웃 (DB 리프레시 토큰 삭제)
router.delete('/users', identifyToken.check.token, authController.deleteAccount); // 회원탈퇴

router.get('/users/profile', identifyToken.check.token, authController.getProfile); // 프로필 정보 가져오기

router.post('/token', identifyToken.check.token, tokenController.saveRefreshToken); // 리프레시 토큰 저장

module.exports = router;
