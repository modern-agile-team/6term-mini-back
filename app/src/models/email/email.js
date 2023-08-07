"use strict";

const nodemailer = require("nodemailer");
require("dotenv").config(); // 환경 변수를 .env 파일에서 가져오기

class Email {
  static async send(reply, email, content) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = { // 메일 옵션
        from: process.env.EMAIL_USER, // 발송 메일 주소
        to: email, // 수신 메일 주소
        subject: `혼영관 ${content} 찾기 요청으로 발신된 이메일입니다.`, // 제목
        text: `혼영관에 ${email} (으)로 가입하신 계정의 ${content}는 ${reply} 입니다.\n외부에 유출되지 않도록 주의해주세요!`, // 내용
      };

      transporter.sendMail(mailOptions, (error, info) => {
        return { success: true, msg: "이메일 발송 성공" };
      });
      
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Email;