import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.utils.js';
import { updateReservationValidator } from '../middlewares/validators/update.reservation.validators.middleware.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { ReservationsController } from '../controllers/reservations.controller.js';

const reservationsRouter = express.Router();

const reservationsController = new ReservationsController();

/** 예약 생성 API **/
reservationsRouter.post('/', requireAccessToken, reservationsController.create);

/** 예약 목록 조회 API **/
reservationsRouter.get('/', reservationsController.readMany);

//------//
//예약 상세조회 : 미들웨어 만들기
reservationsRouter.get(
  '/:id',
  // requireAccessToken,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      let data = await prisma.reservation.findFirst({
        where: {
          id: +id,
        },
      });
      if (!data) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: HTTP_STATUS.NOT_FOUND,
          message: MESSAGES.RESERVATION.READ.IS_NOT_RESERVATION,
        });
      }

      data = {
        user_id: data.userId,
        sitter_id: data.sitterId,
        reserve_id: data.reserveId,
        date: data.date,
        service_type: data.service_type,
        created_at: data.createdAt,
        updated_at: data.updatedAt,

        // user_id,
        // sitter_id,
        // reserve_id,
        // date,
        // service_type,
        // created_at,
        // updated_at,
      };

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESERVATION.READ.SUCCEED,
        data,
      });
    } catch (error) {
      next();
    }
  },
);
//------//

//예약수정 url 라우터 연결 어떻게 할건지
reservationsRouter.patch(
  '/:id',
  updateReservationValidator,
  //연결오류
  reservationsController.updateReservation,
  //controller//
  // async (res, req, next) => {
  //예약수정 : 시터아이디, 날짜, 서비스타입 : 바디로 받아오기

  // try {
  //예약한 아이디가져오기
  // const user = req.user;
  // const userId = user.id;

  //reserveId 가져오기
  // const { id } = req.params;
  //수정할 정보
  // const { sitterId, date, service } = req.body;

  // const authorization = req.headers.authorization;
  // if (!authorization) {
  //   res.status(HTTP_STATUS.UNAUTHORIZED).json({
  //     status: HTTP_STATUS.UNAUTHORIZED,
  //     message: MESSAGE.USER.READ.IS_NOT_EXIST,
  //   });
  // }
  //있는 예약인지 확인하기 : service
  // const existReservation = await prisma.reservation.findUnique({
  //   where: {
  //     id,
  //     sitterId: sitterId,
  //     date: date,
  //     service: service,
  //   },

  //service,
  // });
  // if (!existReservation) {
  //   res.status(HTTP_STATUS.CONFLICT).json({
  //     status: HTTP_STATUS.CONFLICT,
  //     message: MESSAGES.RESERVATION.READ.IS_NOT_RESERVATION,
  //   });
  //   return;
  // }

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

  //     const patchResevation = await prisma.reservation.update({
  //       where: {
  //         id: sitterId,
  //         date: date,
  //       },
  //       patchResevation: {
  //         ...(sitterId && { sitterId }),
  //         ...(date && { date }),
  //       },
  //     });

  //     //controller
  //     return res.status(HTTP_STATUS.OK).json({
  //       status: HTTP_STATUS.OK,
  //       message: MESSAGES.RESERVATION.UPDATE.SUCCED,
  //       patchResevation,
  //     });
  //   } catch (error) {
  //     // next(error);
  //   }
  // },
);
//------//

/** 예약 삭제 API **/
reservationsRouter.delete('/:reserveId', reservationsController.delete);

export { reservationsRouter };
