import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/messages.const.js';
import { Prisma } from '@prisma/client';
import { updateReservationValidator } from '../middlewares/reservation.validators/update.reservation.validators.middleware.js';
// import { reservationsController } from '../controllers/reservations.controller.js';

const reservationRouter = express.Router();

// const reservationController = new reservationController();

//예약수정 url 라우터 연결 어떻게 할건지
reservationRouter.patch(
  '/:reserveId',
  updateReservationValidator,
  // reservationController.update,
  //controller//
  async (res, req, next) => {
    //예약수정 : 시터아이디, 날짜, 서비스타입 : 바디로 받아오기

    try {
      //예약한 아이디가져오기
      // const user = req.user;
      // const userId = user.id;

      //reserveId 가져오기
      const { id } = req.params;
      //수정할 정보
      const { sitter_id, date, service } = req.body;

      // const authorization = req.headers.authorization;
      // if (!authorization) {
      //   res.status(HTTP_STATUS.UNAUTHORIZED).json({
      //     status: HTTP_STATUS.UNAUTHORIZED,
      //     message: MESSAGE.USER.READ.IS_NOT_EXIST,
      //   });
      // }
      //있는 예약인지 확인하기 : service
      const existReservation = await Prisma.reservation.findUnique({
        where: {
          id: sitter_id,
          date: date,
        },
        id,

        //service,
      });
      if (!existReservation) {
        res.status(HTTP_STATUS.CONFLICT).json({
          status: HTTP_STATUS.CONFLICT,
          message: MESSAGES.RESERVATION.READ.IS_NOT_RESERVATION,
        });
        return;
      }

      // //시터아이디 검증 : petSitter.findUnique 맞나
      // const PetSitterId = await Prisma.petSitter.findUnique({
      //   where: { id: id, userId },
      //   include: { userId },
      // });
      // if (!PetSitterId) {
      //   res.status(HTTP_STATUS.BAD_REQUEST).json({
      //     status: HTTP_STATUS.BAD_REQUEST,
      //     message: MESSAGES.IS_NOT_EXIST,
      //   });
      //   return;
      // }
      // //예약날짜 찾기 : 해당 펫시터의 예약 가능한 날짜

      //서비스타입
      const validServiceTypes = Object.values(service);

      if (!validServiceTypes.includes(service)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: HTTP_STATUS.BAD_REQUEST,
          message: MESSAGES.RESERVATION.INVALID_SERVICE_TYPE,
        });
        return;
      }
      const patchResevation = await Prisma.reservation.update({
        where: {
          id: sitter_id,
          date: date,
        },
        patchResevation: {
          ...(sitter_id && { sitter_id }),
          ...(date && { date }),
        },
      });

      //controller
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESERVATION.UPDATE.SUCCED,
        patchResevation,
      });
    } catch (error) {
      // next(error);
    }
  },
);

export default { reservationRouter };
