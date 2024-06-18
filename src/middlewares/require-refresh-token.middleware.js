import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.utils.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { REFRESH_TOKEN_SECRET } from '../constants/env.constants.js';

export const requireRefreshToken = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: '인증 정보가 없습니다.',
      });
    }
    const [type, refreshToken] = authorization.split(' ');
    if (type !== 'Bearer') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: '지원하지 않는 인증 방식입니다.',
      });
    }
    if (!refreshToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: '인증 정보가 없습니다.',
      });
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      //유효기간 지난 경우
      if (error.name === 'TokenExpiredError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: '인증 정보가 만료되었습니다.',
        });
      }
      //그 외 검증실패
      else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: '인증 정보가 유효하지 않습니다.',
        });
      }
    }
    const { id } = payload;
    const existedRefreshToken = await prisma.refreshToken.findUnique({
      where: { userId: id },
    });
    const isValidRefreshToken =
      existedRefreshToken?.token &&
      bcrypt.compareSync(refreshToken, existedRefreshToken.token);
    console.log(isValidRefreshToken);
    if (!isValidRefreshToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: '폐기된 인증 정보입니다.',
      });
    }
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: '인증 정보와 일치하는 사용자가 없습니다.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
