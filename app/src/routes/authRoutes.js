"user strict";

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login); // 로그인, 토큰 발급
router.post('/register', authController.register); // 회원가입
router.get('/check', authController.checkToken); // 토큰 확인 (만료 여부)
router.post('/token', authController.saveRefreshToken); // 리프레시 토큰 DB에 저장
router.get('/token', authController.checkRefreshToken); // 리프레시 토큰 검증

module.exports = router;
