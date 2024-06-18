import { ReservationsService } from '../services/reservations.service.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.utils.js';

const reservationsService = new ReservationsService();

export class ReservationsController {
  /** 예약 생성 API **/
  create = async (req, res, next) => {
    try {
      const user = req.user;
      const userId = user.id;
      const { sitterId, date, service } = req.body;

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

      const data = await reservationsService.create({
        sitterId,
        userId,
        date,
        service,
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
  };

  /** 예약 목록 조회 API **/
  readMany = async (req, res, next) => {
    try {
      const user = req.user;
      const userId = user.id;

      let { sort } = req.query;

      sort = sort?.toLowerCase();

      if (sort !== 'desc' && sort !== 'asc') {
        sort = 'desc';
      }

      const data = await reservationsService.readMany({ userId, sort });

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESERVATIONS.READ_LIST.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /** 예약 삭제 API **/
  delete = async (req, res, next) => {
    try {
      const user = req.user;
      const userId = user.id;
      const { reserveId } = req.params;

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESERVATIONS.DELETE.SUCCEED,
        data: { id: data.id },
      });
    } catch (error) {
      next(error);
    }
  };
}
