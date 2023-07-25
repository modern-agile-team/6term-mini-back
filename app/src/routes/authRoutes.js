"user strict";

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login); // 로그인, 토큰 발급
router.post('/register', authController.register); // 회원가입
router.get('/usersId', authController.checkUserLoginId); // 아이디 중복 확인
router.get('/usersEmail', authController.checkUserEmail); // 이메일 중복 확인

router.get('/loginId', authController.findLoginId); // 아이디 찾기

router.get('/check', authController.checkToken); // 토큰 확인 (유효 여부)

router.post('/token', authController.saveRefreshToken); // 리프레시 토큰 DB에 저장
router.get('/token', authController.checkRefreshToken); // 리프레시 토큰 검증

module.exports = router;
