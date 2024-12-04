const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 8082;

app.use(cookieParser());

app.listen(port, () => console.log(`서버 켜짐 : http://localhost:${port}`));

const userRouter = require('./routes/user');
const channelRouter = require('./routes/channel');

app.use('/', userRouter);
app.use('/channel', channelRouter);
