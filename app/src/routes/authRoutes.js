"user strict";

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/check', authController.checkToken);

module.exports = router;
