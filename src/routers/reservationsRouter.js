import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/messages.const.js';
import { prisma } from '../utils/prisma.utils.js';
import { updateReservationValidator } from '../middlewares/reservation.validators/update.reservation.validators.middleware.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { ReservationsController } from '../controllers/reservations.controller.js';

const reservationsRouter = express.Router();

const reservationsController = new ReservationsController();

// 예약 생성 API
reservationsRouter.post('/', requireAccessToken, async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.id;
    const { sitterId, date, service } = req.body;
    console.log('req.body-->', req.body);
    // 필수 입력 필드 검증
    if (!sitterId || !date || !service) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'OOO를 입력해 주세요.',
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
      message: MESSAGES.RESERVATION.CREATE.SUCCEED,
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
reservationsRouter.get('/', async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.id;
    let { sort } = req.query;
    sort = sort?.toLowerCase();
    if (sort !== 'desc' && sort !== 'asc') {
      sort = 'desc';
    }
    let data = await prisma.reservation.findMany({
      where: {
        userId: +userId,
      },
      orderBy: {
        createdAt: sort,
      },
    });
    data = data.map((reservation) => {
      return {
        reserveId: reservation.id,
        userId: reservation.userId,
        sitterId: reservation.sitterId,
        date: reservation.date,
        serviceType: reservation.service,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt,
      };
    });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESERVATION.READ.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});
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
  // updateReservationValidator,
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
reservationsRouter.delete('/:id', async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.id;
    const { id } = req.params;
    const existedReservation = await prisma.reservation.findUnique({
      where: { userId: +userId, id: +id },
    });
    if (!existedReservation) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESERVATION.COMMON.NOT_FOUND,
      });
    }
    const data = await prisma.reservation.delete({
      where: { userId: +userId, id: +id },
    });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESERVATION.DELETE.SUCCEED,
      data: { id: data.id },
    });
  } catch (error) {
    next(error);
  }
});
export { reservationsRouter };
