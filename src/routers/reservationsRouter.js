import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.utils.js';

const reservationsRouter = express.Router();

// 예약 생성 API
reservationsRouter.post('/', async (req, res) => {
  const { userId, sitterId, date, service } = req.body;

  try {
    const reservation = await prisma.reservation.create({
      data: {
        userId: Number(userId),
        sitterId: Number(sitterId),
        date: new Date(date),
        service: service,
      },
      include: {
        User: true,
        PetSitter: true,
      },
    });

    res.status(HTTP_STATUS.CREATED).json(reservation);
  } catch (error) {
    console.error('예약 생성 실패:', error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: '예약을 생성할 수 없습니다.' });
  }
});


// 예약 조회 API
reservationsRouter.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        User: true,
        PetSitter: true,
      },
    });

    res.status(HTTP_STATUS.OK).json(reservations);
  } catch (error) {
    console.error('예약 조회 실패:', error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: '예약을 조회할 수 없습니다.' });
  }
});

/** 예약 삭제 API **/
reservationsRouter.delete('/:reserveId', async (req, res, next) => {
  try {
    const { reserveId } = req.params;

    const existedReservation = await prisma.reservations.findUnique({
      where: { reserveId: +reserveId },
    });

    if (!existedReservation) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESERVATIONS.COMMON.NOT_FOUND,
      });
    }

    const data = await prisma.reservations.delete({
      where: { reserveId: +reserveId },
    });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESERVATIONS.DELETE.SUCCEED,
      data: { id: data.reserveId },
    });
  } catch (error) {
    next(error);
  }
});

export { reservationsRouter };
