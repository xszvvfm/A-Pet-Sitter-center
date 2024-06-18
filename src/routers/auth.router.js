import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET,} from '../constants/env.constants.js';
import { prisma } from '../utils/prisma.utils.js';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';

const authRouter = express.Router();


//회원가입
authRouter.post('/sign-up', async (req, res, next) => {
  try {
    const { email, password, passwordConfirm, username } = req.body;
    const existedUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existedUser) {
      return res.status(400).json({ message: '이미 가입 된 사용자입니다.' });
    }
    if (password !== passwordConfirm) {
      return res
        .status(400)
        .json({ message: '비밀번호 값이 일치하지 않습니다.' });
    }
    const hassedPassword = bcrypt.hashSync(password, 10);
    const { _password, ...user } = await prisma.user.create({
      data: {
        email,
        password: hassedPassword,
        username,
      },
    });
    res.status(201).json({ status: 200, message: '회원가입에 성공했습니다.' });
  } catch (error) {
    next(error);
  }
});

//로그인
authRouter.post('/sign-in', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ message: '가입되지 않은 이메일입니다.' });
    }
    const passwordCheck = bcrypt.compareSync(password, user.password);
    if (!passwordCheck) {
      return res.status(400).json({ message: '비밀번호를 확인해주세요.' });
    }
    const payload = { id: user.id };
    const data = await generateAuthTokens(payload);
    return res
      .status(200)
      .json({ status: 200, message: '로그인에 성공하였습니다.', data });
  } catch (error) {
    next(error);
  }
});
// 토큰 재발급
authRouter.post('/token', requireRefreshToken, async (req, res, next) => {
  try {
    const user = req.user;
    const payload = { id: user.id };
    const data = await generateAuthTokens(payload);

    return res
      .status(200)
      .json({ status: 200, message: '토큰이 발급되었습니다', data });
  } catch (error) {
    next(error);
  }
});

//로그아웃
authRouter.post('/sign-out', requireRefreshToken, async (req, res, next) => {
  try {
    const user = req.user;
    await prisma.refreshToken.update({
      where: { userId: user.id },
      data: { token: null },
    });
    return res
      .status(200)
      .json({
        status: 200,
        message: '로그아웃 하였습니다.',
        data: { id: user.id },
      });
  } catch (error) {
    next(error);
  }
});

//토큰생성 함수
const generateAuthTokens = async (payload) => {
  const userId = payload.id;
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: '12h',
  });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);

  //refreshtoken 생성하거나 갱신
  await prisma.refreshToken.upsert({
    where: {
      userId,
    },
    update: {
      token: hashedRefreshToken,
    },
    create: {
      userId,
      token: hashedRefreshToken,
    },
  });
  return { accessToken, refreshToken };
};

export { authRouter };
