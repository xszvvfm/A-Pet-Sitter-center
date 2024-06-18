import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET,} from '../constants/env.constants.js';
import { prisma } from '../utils/prisma.utils.js';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';
import { authConstant } from '../constants/auth.constant.js';
//import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
//import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
const authRouter = express.Router();


//회원가입
authRouter.post('/sign-up', async (req, res, next) => {
  try {
    const { email, password, passwordConfirm, username } = req.body;
    const existedUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existedUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({ message: MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED});
    }
    if (password !== passwordConfirm) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.NOT_MACHTED_PASSWORD });
    }
    const hassedPassword = bcrypt.hashSync(password, authConstant.HASH_SALT_ROUNDS);
    const { _password, ...user } = await prisma.user.create({
      data: {
        email,
        password: hassedPassword,
        username,
      },
    });
    res.status(HTTP_STATUS.OK).json({ status: HTTP_STATUS.OK, message: MESSAGES.AUTH.SIGN_UP.SUCCEED});
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
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.AUTH.SIGN_IN.NOT_USER});
    }
    const passwordCheck = bcrypt.compareSync(password, user.password);
    if (!passwordCheck) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.NOT_MACHTED_PASSWORD});
    }
    const payload = { id: user.id };
    const data = await generateAuthTokens(payload);
    return res
      .status(HTTP_STATUS.OK)
      .json({ status: HTTP_STATUS.OK, message: MESSAGES.AUTH.SIGN_IN.SUCCEED, data });
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
      .status(HTTP_STATUS.OK)
      .json({ status: HTTP_STATUS.OK, message: MESSAGES.AUTH.TOKEN.SUCCEED, data });
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
      .status(HTTP_STATUS.OK)
      .json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
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
