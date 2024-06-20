import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { prisma } from '../utils/prisma.utils.js';

const userRouter = express.Router();
//내정보 조회
userRouter.get('/user', requireAccessToken, async (req, res, next) => {
  try {
    const { id } = req.user;
    const data = await prisma.user.findUnique({
      where: { id: +id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        reservations: {
          select: {
            id: true,
            sitterId: true,
            date: true,
            service: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.USER.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

//내정보 수정
userRouter.patch('/user', requireAccessToken, async (req, res, next) => {
  try {
    const { id } = req.user;
    const { username } = req.body;
    if (!username) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: '수정할 정보를 입력해주세요' });
    }
    const user = await prisma.user.findUnique({
      where: { id: +id },
    });

    if (username === user.username) {
      return res
        .status(400)
        .json({ message: '동일한 이름입니다. 다시 수정해주세요' });
    }

    //중복체크
    const existedName = await prisma.user.findFirst({
      where: { username },
    });
    if (existedName) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        message: '이미 존재하는 이름입니다.',
      });
    }

    const updateData = { username };
    const updateUserInfo = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    const userInfo = {
      id: updateUserInfo.id,
      email: updateUserInfo.email,
      username: updateUserInfo.username,
      createdAt: updateUserInfo.createdAt,
      updateData: updateUserInfo.updatedAt,
    };
    return res
      .status(HTTP_STATUS.OK)
      .json({ message: '정보가 수정되었습니다.', data: userInfo });
  } catch (error) {
    next(error);
  }
});

export { userRouter };
