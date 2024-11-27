const express = require('express');

const router = express.Router();

router.use(express.static('public'));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const db = new Map();

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

  const channels = [...db.values()].filter((channel) => channel.userId === userId);

  const channelList = channels
    .map((channel) => {
      return `
      <div class="channel-item">
        <p>${channel.title}</p>
        <p>동영상 ${channel.videoCount}개</p>
        <p>구독자 ${channel.subscribeCount}명</p>
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
            ${channels.length > 0 ? channelList : '<p>채널이 없습니다.</p>'}
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
            <form action="/channel/create" method="POST" onsubmit="return postChannel(event)">
              <input type="text" name="title" id="title" placeholder="채널 제목" required />
              <button type="submit">생성</button>
            </form>
          </div>
        </body>
      </html>
    `);
  })
  .post((req, res) => {
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

    if (db.has(title)) {
      return res.status(400).json({ message: '중복된 채널명입니다.' });
    }

    const newChannel = { title, userId: userId, videoCount: 0, subscribeCount: 0 };
    db.set(title, newChannel);

    res.status(200).json({ message: '채널이 생성되었습니다.' });
  });

router.route('/delete/:title').delete((req, res) => {
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
  const channel = db.get(title);

  if (channel.userId !== userId) {
    return res.status(404).json({ message: '채널 삭제 권한이 없습니다.' });
  }
  if (!channel) {
    return res.status(404).json({ message: '채널을 찾을 수 없습니다.' });
  }

  db.delete(title);
  res.status(200).json({ message: '채널이 삭제되었습니다.' });
});

module.exports = router;
