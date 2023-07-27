"user strict";

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login); // 로그인, 토큰 발급
router.delete('/logout', authController.logout); // 로그아웃 (DB 리프레시 토큰 삭제)
router.post('/register', authController.register); // 회원가입
router.delete('/users', authController.deleteAccount); // 회원 탈퇴

router.post('/users/id', authController.checkUserLoginId); // 아이디 중복 확인
router.post('/users/email', authController.checkUserEmail); // 이메일 중복 확인

router.get('/id', authController.findLoginId); // 아이디 찾기
router.get('/pw', authController.findPw); // 비밀번호 찾기

router.get('/check', authController.checkToken); // 토큰 확인 (유효 여부)
router.get('/users/profile', authController.getProfile); // 프로필 정보 가져오기

router.post('/token', authController.saveRefreshToken); // 리프레시 토큰 DB에 저장
router.get('/token', authController.checkRefreshToken); // 리프레시 토큰 검증

module.exports = router;