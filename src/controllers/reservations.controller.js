// import { ReservationsService } from '../services/reservations.service.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';
import { prisma } from '../utils/prisma.utils.js';

export class ReservationsController {
  constructor(reservationsService) {
    this.reservationsService = reservationsService;
  }

  /** 예약 생성 API **/
  create = async (req, res, next) => {
    try {
      const user = req.user;
      const userId = user.id;
      const { sitterId, date, service } = req.body;
      console.log(sitterId);

      const data = await this.reservationsService.create(
        sitterId,
        userId,
        date,
        service,
      );

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.RESERVATIONS.CREATE.SUCCEED,
        data: {
          id: data.id,
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

      const data = await this.reservationsService.readMany(userId, sort);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESERVATIONS.READ.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  //상세조회

  reservationReadOne = async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await this.reservationsService.reservationReadOne(id);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESERVATIONS.READ.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  //예약수정///
  //상세조회
  getReservationById = async (req, res, next) => {
    try {
      const { id } = req.params;

      const oneReservation =
        await this.reservationsService.findReservationById(id);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESERVATIONS.READ.SUCCEED,
        oneReservation,
      });
    } catch (error) {
      next(error);
    }
  };

  //
  updateReservation = async (req, res, next) => {
    //예약수정 : 시터아이디, 날짜, 서비스타입 : 바디로 받아오기

    try {
      //예약한 아이디가져오기
      const user = req.user;
      const userId = user.id;
      //reserveId 가져오기
      const { id } = req.params;
      //수정할 정보
      const { sitterId, date, service } = req.body;
      //------//
      //있는 예약인지 확인하기 : service

      //해당 펫시터에게 예약이 있는 날짜인지 확인하기
      // 펫시터정보를 어디서 가져올지? 펫시터의 예약의-> 날짜

      /////------------------추가부분----------------------////////
      //레파지토리
      // const alreadyReservation = await prisma.reservation.findFirst({
      //   where: { sitterId: +sitterId, date },
      // });
      // console.log('alreadyReservation-->', alreadyReservation);

      // //서비스
      // //alreadyReservation 이 null 이면 해당 날짜에 예약이 없는 것=> 예약가능하게
      // const isMyReservation =
      //   userId === alreadyReservation.userId && id === alreadyReservation.id;
      // //안되는 경우 먼저 거르기
      // if (alreadyReservation && !isMyReservation) {
      //   throw new HttpError.Conflict('이미 예약된 정보입니다.');
      // }
      const updatedReservation =
        await this.reservationsService.updateReservation(
          parseInt(id),
          parseInt(sitterId),
          new Date(date),
          service,
          userId,
        );

      //컨트롤러//
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESERVATIONS.UPDATE.SUCCEED,
        updatedReservation,
      });
      //--------추가구현부분-----------//

      //-----//가져올 아이디 등 어떻게 가져올지 다시 보기 :
    } catch (error) {
      next(error);
    }
  };

  /** 예약 삭제 API **/
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await this.reservationsService.delete(id);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESERVATIONS.DELETE.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
