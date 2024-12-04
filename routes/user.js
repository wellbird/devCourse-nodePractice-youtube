const express = require('express');
const conn = require('../mariaDB');
const { body, param, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

router.use(express.static('public'));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) return next();
  return res.status(404).json({ message: err.message });
};

router.route('/').get((req, res) => {
  res.send(`
        <!DOCTYPE html>
        <html lang="kr">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="/css/style.css" />
            <title>데브코스 유튜브</title>
        </head>
        <body>
            <div class="container">
                <h1>데브코스 유튜브</h1>
                <button onclick="location.href='/register'">회원 가입</button>
                <button onclick="location.href='/login'">로그인</button>
            </div>
        </body>
        </html>
    `);
});

router
  .route('/login')
  .get((req, res) => {
    res.send(`
          <!DOCTYPE html>
          <html lang="kr">
          <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="stylesheet" href="/css/style.css" />
              <script src="/js/postLogin.js"></script>
              <title>로그인</title>
          </head>
          <body>
              <div class="container">
                  <h1>로그인</h1>
                  <form action="/login" method="POST" onsubmit="return postLogin(event)">
                      <input type="text" name="id" id="id" placeholder="아이디" required />
                      <input type="password" name="pwd" id="pwd" placeholder="비밀번호" required />
                      <button type="submit">로그인</button>
                  </form>
              </div>
          </body>
          </html>
      `);
  })
  .post(
    [
      body('id').notEmpty().isString().withMessage('잘못된 입력입니다.'),
      body('pwd').notEmpty().withMessage('비밀번호를 입력해주세요.'),
      validate,
    ],
    (req, res, next) => {
      const { id, pwd } = req.body;

      const sql = 'SELECT * FROM users WHERE user_id = ?';
      conn.query(sql, id, (err, results, fields) => {
        if (err) {
          return res.status(404).json({ message: '알 수 없는 에러가 발생하였습니다.' });
        } else {
          const user = results[0];
          if (!user || pwd !== user.pwd)
            return res.status(403).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
          else {
            const token = jwt.sign({ userId: id }, process.env.PRIVATE_KEY, { expiresIn: '30m', issuer: 'JW' });

            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
            return res.status(200).json({ message: '로그인에 성공하였습니다.' });
          }
        }
      });
    }
  );

router.route('/logout').post((req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: '로그아웃되었습니다.' });
});

router
  .route('/register')
  .get((req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="kr">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="/css/style.css" />
              <script src="/js/postRegister.js"></script>
            <title>회원 가입</title>
        </head>
        <body>
            <div class="container">
                <h1>회원 가입</h1>
                <form action="/register" method="POST" onsubmit="return postRegister(event)">
                    <input type="text" name="id" id="id" placeholder="아이디" required />
                    <input type="password" name="pwd" id="pwd" placeholder="비밀번호" required />
                    <input type="text" name="name" id="name" placeholder="이름" required />
                    <button type="submit">가입</button>
                </form>
            </div>
        </body>
        </html>
    `);
  })
  .post(
    [
      body('id').notEmpty().isString().withMessage('잘못된 아이디 입력입니다.'),
      body('pwd').notEmpty().withMessage('잘못된 비밀번호 입력입니다.'),
      body('name').notEmpty().isString().withMessage('잘못된 이름 입력입니다.'),
      validate,
    ],
    (req, res, next) => {
      const { id, pwd, name } = req.body;

      const sql = 'INSERT INTO users (user_id, pwd, name) VALUES (?, ?, ?)';
      conn.query(sql, [id, pwd, name], (err, results, fields) => {
        if (err) {
          return res.status(401).json({ message: '중복되는 아이디가 존재합니다.' });
        } else {
          return res.status(200).json({ message: '회원가입에 성공하였습니다.' });
        }
      });
    }
  );

router
  .route('/user/:id')
  .get([param('id').notEmpty().isString().withMessage('잘못된 아이디 정보입니다.'), validate], (req, res, next) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    conn.query(sql, id, (err, results, fields) => {
      if (err) {
        return res.status(500).json({ message: '알 수 없는 오류가 발생하였습니다.' });
      } else {
        if (results.length === 0) return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
        const user = results[0];
        return res.send(`
          <!DOCTYPE html>
          <html lang="kr">
          <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="stylesheet" href="/css/style.css" />
              <script src="/js/deleteUser.js"></script>
              <script src="/js/postLogout.js"></script>
              <title>사용자 정보</title>
          </head>
          <body>
              <div class="container">
                  <h1>사용자 정보</h1>
                  <p>아이디: ${user.user_id}</p>
                  <p>이름: ${user.name}</p>
                  <button onclick="postLogout(event)">로그아웃</button>
                  <button onclick="window.location.href='/channel'">채널 관리</button>
                  <button onclick="confirmDelete('${user.user_id}')">회원 탈퇴</button>
              </div>
              <script>
                  function confirmDelete(id) {
                    const confirmation = confirm('정말로 탈퇴하시겠습니까?');
                    if (confirmation) {
                        deleteUser(id);
                    }
                  }
              </script>
          </body>
          </html>
        `);
      }
    });
  })
  .delete([param('id').notEmpty().isString().withMessage('잘못된 아이디 정보입니다.'), validate], (req, res, next) => {
    const id = req.params.id;
    const sql = 'DELETE FROM users WHERE user_id = ?';
    conn.query(sql, id, (err, results, fields) => {
      if (err) {
        return res.status(404).json({ message: '한 개 이상의 채널을 보유중입니다.' });
      } else {
        if (results.affectedRows === 1) {
          res.clearCookie('token');
          return res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
        } else {
          return res.status(404).json({ message: '존재하지 않는 사용자입니다.' });
        }
      }
    });
  });

module.exports = router;
