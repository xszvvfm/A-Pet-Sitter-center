
import express from 'express';
import prisma from '../prisma-client.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { errorHandler } from '../middlewares/error-handler.middleware.js';

const router = express.Router();

// 예약 생성 API
router.post('/', async (req, res) => {
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
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: '예약을 생성할 수 없습니다.' });
  }
});

// 예약 조회 API
router.get('/', async (req, res) => {
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
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: '예약을 조회할 수 없습니다.' });
  }
});

export default router;
