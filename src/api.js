const express = require('express');
const userRouter = require('./routes/userRouter');
const loginRouter = require('./routes/loginRouter');
const categoryRouter = require('./routes/categoryRouter');
const postRouter = require('./routes/postRouter');
const errorMiddleware = require('./middlewares/error');

const app = express();
app.use(express.json());

app.use('/login', loginRouter);

app.use('/user', userRouter);

app.use('/categories', categoryRouter);

app.use('/post', postRouter);

app.use(errorMiddleware);

module.exports = app;
