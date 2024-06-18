import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
// import { createReservationValidator } from '../middlewares/validators/create-reservation-validator.middleware.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { prisma } from '../utils/prisma.utils.js';

const reservationsRouter = express.Router();

// 예약 생성 API
reservationsRouter.post('/', requireAccessToken, async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.id;
    const { sitterId, date, service } = req.body;

    console.log(req.body);

    // 필수 필드 검증
    if (!sitterId || !date || !service) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: '필수 필드가 누락되었습니다.',
      });
    }

    // PetSitter가 존재하는지 확인
    const petSitter = await prisma.petSitter.findUnique({
      where: { id: +sitterId },
    });

    if (!petSitter) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: '유효하지 않은 sitterId입니다.',
      });
    }

    const data = await prisma.reservation.create({
      data: {
        sitterId: +sitterId,
        userId: +userId,
        date: new Date(date),
        service,
      },
    });

    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.RESERVATIONS.CREATE.SUCCEED,
      data: {
        reserveId: data.id,
        userId: data.userId,
        sitterId: data.sitterId,
        date: data.date,
        serviceType: data.service,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 예약 조회 API
// reservationsRouter.get('/', async (req, res) => {
//   const { userId } = req.query;

//   try {
//     const reservations = await prisma.reservation.findMany({
//       where: {
//         userId: Number(userId),
//       },
//       include: {
//         User: true,
//         PetSitter: true,
//       },
//     });

//     res.status(HTTP_STATUS.OK).json(reservations);
//   } catch (error) {
//     console.error('예약 조회 실패:', error);
//     res
//       .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
//       .json({ error: '예약을 조회할 수 없습니다.' });
//   }
// });

/** 예약 삭제 API **/
reservationsRouter.delete('/:reserveId', async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.id;
    const { reserveId } = req.params;

    const existedReservation = await prisma.reservation.findUnique({
      where: { userId: +userId, id: +reserveId },
    });

    if (!existedReservation) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESERVATIONS.COMMON.NOT_FOUND,
      });
    }

    const data = await prisma.reservation.delete({
      where: { userId: +userId, id: +reserveId },
    });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESERVATIONS.DELETE.SUCCEED,
      data: { id: data.id },
    });
  } catch (error) {
    next(error);
  }
});

export { reservationsRouter };
