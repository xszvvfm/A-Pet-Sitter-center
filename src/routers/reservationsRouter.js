import express from 'express';
// import { createReservationValidator } from '../middlewares/validators/create-reservation-validator.middleware.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { ReservationsController } from '../controllers/reservations.controller.js';

const reservationsRouter = express.Router();

const reservationsController = new ReservationsController();

/** 예약 생성 API **/
reservationsRouter.post('/', requireAccessToken, reservationsController.create);

/** 예약 목록 조회 API **/
reservationsRouter.get('/', reservationsController.readMany);

/** 예약 삭제 API **/
reservationsRouter.delete('/:reserveId', reservationsController.delete);

export { reservationsRouter };
