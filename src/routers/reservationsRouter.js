import express from 'express';
import { prisma } from '../utils/prisma.utils.js';
import { createReservationValidator } from '../middlewares/validators/create-reservation-validator.middleware.js';
import { updateReservationValidator } from '../middlewares/validators/update.reservation.validators.middleware.js';
import { ReservationsController } from '../controllers/reservations.controller.js';
import { ReservationsService } from '../services/reservations.service.js';
import { ReservationsRepository } from '../repositories/reservations.repository.js';

const reservationsRouter = express.Router();

const reservationsRepository = new ReservationsRepository(prisma);
const reservationsService = new ReservationsService(reservationsRepository);
const reservationsController = new ReservationsController(reservationsService);

/** 예약 생성 API **/
reservationsRouter.post(
  '/',
  createReservationValidator,
  reservationsController.create,
);

/** 예약 목록 조회 API **/
reservationsRouter.get('/', reservationsController.readMany);

//예약 상세조회 : 미들웨어 만들기
reservationsRouter.get('/:id', reservationsController.reservationReadOne);

//예약수정 url 라우터 연결 어떻게 할건지
reservationsRouter.patch(
  '/:id',
  updateReservationValidator,
  //연결오류
  reservationsController.updateReservation,
);

/** 예약 삭제 API **/
reservationsRouter.delete('/:id', reservationsController.delete);

export { reservationsRouter };
