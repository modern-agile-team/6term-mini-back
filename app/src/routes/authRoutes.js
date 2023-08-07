"user strict";

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const identifyToken = require('../middlewares/identifyToken');

router.post('/login', authController.sign.login); // 로그인, 토큰 발급
router.post('/register', authController.sign.register); // 회원가입

router.post('/users/id', authController.check.checkUserLoginId); // 아이디 중복 확인
router.post('/users/email', authController.check.checkUserEmail); // 이메일 중복 확인

router.post('/id', authController.check.findLoginId); // 아이디 찾기
router.post('/pw', authController.check.findPw); // 비밀번호 찾기

router.post('/token', identifyToken.check.newToken); // 토큰 갱신

router.delete('/logout', identifyToken.check.token, authController.sign.logout); // 로그아웃 (DB 리프레시 토큰 삭제)
router.delete('/users', identifyToken.check.token, authController.sign.deleteAccount); // 회원탈퇴

router.get('/users/profile', identifyToken.check.token, authController.check.getProfile); // 프로필 정보 가져오기

module.exports = router;
