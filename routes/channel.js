const express = require('express');
const conn = require('../mariaDB');
const { body, param, validationResult } = require('express-validator');

const router = express.Router();

router.use(express.static('public'));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.route('/').get((req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send(`
        <script>
            alert("로그인 정보를 찾을 수 없습니다.");
            window.location.href = "/login";
        </script>
      `);
  }

  const sql = 'SELECT * FROM channels WHERE user_id = ?';
  conn.query(sql, userId, (err, results, fields) => {
    if (err) {
      return res.status(404).json({ message: '알 수 없는 에러가 발생하였습니다.' });
    } else {
      const channelList = results
        .map((channel) => {
          return `
        <div class="channel-item">
          <p>${channel.title}</p>
          <p>동영상 ${channel.video_count}개</p>
          <p>구독자 ${channel.subscribe_count}명</p>
          <div class="button-container">
            <button onclick="location.href='/channel/edit/${channel.title}'">수정</button>
            <button onclick="confirmDelete('${channel.title}')">삭제</button>
          </div>
        </div>
      `;
        })
        .join('');

      res.send(`
        <!DOCTYPE html>
        <html lang="kr">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="/css/style.css" />
            <script src="/js/deleteChannel.js"></script>
            <title>채널 관리</title>
            </head>
            <body>
            <div class="container">
                <h1>채널 관리</h1>
                <button onclick="location.href='/channel/create'">채널 생성</button>
                <hr/>
                <h3>내 채널 목록</h3>
                ${results.length > 0 ? channelList : '<p>채널이 없습니다.</p>'}
            </div>
            <script>
                function confirmDelete(title) {
                const confirmation = confirm('정말로 삭제하시겠습니까?');
                if (confirmation) {
                    deleteChannel(title);
                }
                }
            </script>
            </body>
        </html>
      `);
    }
  });
});

router
  .route('/create')
  .get((req, res) => {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).send(`
        <script>
            alert("로그인 상태가 아닙니다.");
            window.location.href = "/login";
        </script>
      `);
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="kr">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="/css/style.css" />
          <script src="/js/postChannel.js"></script>
          <title>채널 생성</title>
        </head>
        <body>
          <div class="container">
            <h1>채널 생성</h1>
            <form action="/channel/create" onsubmit="return postChannel(event)">
              <input type="text" name="title" id="title" placeholder="채널 제목" required />
              <button type="submit">생성</button>
            </form>
          </div>
        </body>
      </html>
    `);
  })
  .post(body('title').notEmpty().isString().withMessage('채널명을 입력해주세요.'), (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) res.status(401).json({ message: err.msg });
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send(`
        <script>
            alert("로그인 정보를 찾을 수 없습니다.");
            window.location.href = "/login";
        </script>
        `);
    }

    const { title } = req.body;

    const sql = 'INSERT INTO channels (title, user_id) VALUES (?, ?)';
    conn.query(sql, [title, userId], (err, results, fields) => {
      if (err) {
        return res.status(401).json({ message: '중복된 채널명입니다.' });
      } else {
        return res.status(200).json({ message: '채널이 생성되었습니다.' });
      }
    });
  });

router
  .route('/edit/:title')
  .get(param('title').notEmpty().isString().withMessage('잘못된 채널명 입니다.'), (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) res.status(401).json({ message: err.msg });

    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).send(`
        <script>
          alert("로그인 상태가 아닙니다.");
          window.location.href = "/login";
        </script>
      `);
    }

    const title = req.params.title;

    const sql = 'SELECT * FROM channels WHERE title = ?';
    conn.query(sql, title, (err, results, fields) => {
      if (err) {
        return res.status(404).json({ message: '채널 정보를 찾을 수 없습니다.' });
      } else {
        const channelInfo = results[0];
        if (userId !== channelInfo.user_id) return res.status(404).json({ message: '채널 수정 권한이 없습니다.' });
        return res.send(`
          <!DOCTYPE html>
          <html lang="kr">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="stylesheet" href="/css/style.css" />
              <script src="/js/putChannel.js"></script>
              <title>채널 수정</title>
            </head>
            <body>
              <div class="container">
                <h1>채널 수정</h1>
                <form onsubmit="return putChannel(event, '${channelInfo.title}')">
                  <input type="text" name="title" id="title" value="${channelInfo.title}" required />
                  <button type="submit">수정</button>
                </form>
              </div>
            </body>
          </html>
        `);
      }
    });
  })
  .put(param('title').notEmpty().isString().withMessage('잘못된 채널명 입니다.'), (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) res.status(401).json({ message: err.msg });

    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send(`
        <script>
          alert("로그인 정보를 찾을 수 없습니다.");
          window.location.href = "/login";
        </script>
      `);
    }

    const title = req.params.title;

    const getSql = 'SELECT * FROM channels WHERE title = ?';
    const updateSql = 'UPDATE channels SET title = ? WHERE title = ?';

    conn.query(getSql, title, (err, results, fields) => {
      if (err) {
        return res.status(404).json({ message: '채널 정보를 찾을 수 없습니다.' });
      } else {
        const channelInfo = results[0];
        if (userId !== channelInfo.user_id) return res.status(404).json({ message: '채널 수정 권한이 없습니다.' });
        const { newTitle } = req.body;
        return conn.query(updateSql, [newTitle, title], (err, results, fields) => {
          if (err) {
            return res.status(401).json({ message: '중복된 채널명입니다.' });
          } else {
            if (results.affectedRows === 0) return res.status(401).json({ message: '수정에 실패하였습니다.' });
            return res.status(200).json({ message: '채널이 수정되었습니다.' });
          }
        });
      }
    });
  });

router
  .route('/delete/:title')
  .delete(param('title').notEmpty().isString().withMessage('잘못된 채널명 입니다.'), (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) res.status(401).json({ message: err.msg });
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send(`
        <script>
            alert("로그인 정보를 찾을 수 없습니다.");
            window.location.href = "/login";
        </script>
      `);
    }

    const title = req.params.title;

    const getSql = 'SELECT * FROM channels WHERE title = ?';
    const deleteSql = 'DELETE FROM channels WHERE title = ?';

    conn.query(getSql, title, (err, results, fields) => {
      if (err) {
        return res.status(404).json({ message: '채널을 찾을 수 없습니다.' });
      } else {
        const channelInfo = results[0];
        if (userId !== channelInfo.user_id) return res.status(404).json({ message: '채널 삭제 권한이 없습니다.' });
        return conn.query(deleteSql, title, (err, results, fields) => {
          if (err) {
            return res.status(404).json({ message: '채널을 찾을 수 없습니다.' });
          } else {
            if (results.affectedRows === 1) {
              return res.status(200).json({ message: '채널 삭제가 완료되었습니다.' });
            } else {
              return res.status(404).json({ message: '존재하지 않는 채널입니다.' });
            }
          }
        });
      }
    });
  });

module.exports = router;
