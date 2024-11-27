const express = require('express');
const session = require('express-session');

const app = express();
const port = 8082;

app.use(
  session({
    secret: 'devCourse',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.listen(port, () => console.log(`서버 켜짐 : http://localhost:${port}`));

const userRouter = require('./routes/user');
const channelRouter = require('./routes/channel');

app.use('/', userRouter);
app.use('/', channelRouter);
