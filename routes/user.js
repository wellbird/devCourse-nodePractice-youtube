const express = require('express');
const session = require('express-session');

const router = express.Router();

router.use(express.static('public'));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

let db = new Map();

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
  .post((req, res) => {
    const { id, pwd } = req.body;
    if (db.get(id) === undefined) res.status(401).json({ message: '회원 정보를 찾을 수 없습니다.' });
    else {
      if (db.get(id).pwd !== pwd) res.status(401).json({ message: '잘못된 비밀번호 입니다.' });
      else {
        req.session.userId = id;
        res.status(200).json({ message: '로그인에 성공하였습니다.' });
      }
    }
  });

router.route('/logout').post((req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다.' });
    }
    res.status(200).json({ message: '로그아웃되었습니다.' });
  });
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
  .post((req, res) => {
    const { id, pwd, name } = req.body;
    if (db.get(id) !== undefined) res.status(401).json({ message: '중복되는 아이디가 존재합니다.' });
    else {
      db.set(id, { id, pwd, name });
      res.status(200).json({ message: '회원가입에 성공하였습니다.' });
    }
  });

router
  .route('/user/:id')
  .get((req, res) => {
    const id = req.params.id;
    const user = db.get(id);
    if (user !== undefined) {
      res.send(`
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
                <p>아이디: ${user.id}</p>
                <p>이름: ${user.name}</p>
                <button onclick="postLogout(event)">로그아웃</button>
                <button onclick="window.location.href='/channel'">채널 관리</button>
                <button onclick="confirmDelete('${user.id}')">회원 탈퇴</button>
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
    } else {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
  })
  .delete((req, res) => {
    const id = req.params.id;
    if (db.delete(id)) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: '회원 탈퇴 중 오류가 발생했습니다.' });
        }
        return res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
      });
    }
    res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  });

module.exports = router;
