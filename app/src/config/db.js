const mysql = require("mysql2");
require("dotenv").config(); // 환경 변수를 .env 파일에서 가져오기

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect();

module.exports = db;
