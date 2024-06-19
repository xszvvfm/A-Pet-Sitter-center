import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { prisma } from '../utils/prisma.utils.js';

const userRouter = express.Router();

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

export { userRouter };
