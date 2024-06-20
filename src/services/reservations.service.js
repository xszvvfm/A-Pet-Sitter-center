import { HttpError } from '../errors/http.error.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.utils.js';

export class ReservationsService {
  constructor(reservationsRepository) {
    this.reservationsRepository = reservationsRepository;
  }

  /** 예약 생성 API **/
  create = async (sitterId, userId, date, service) => {
    // PetSitter가 존재하는지 확인
    const petSitter =
      await this.reservationsRepository.findBySitterId(sitterId);

    if (!petSitter) {
      throw new HttpError.BadRequest(
        MESSAGES.RESERVATIONS.COMMON.SITTER_ID.INVALID,
      );
    }

    // 동일한 펫시터와 날짜로 이미 예약이 있는지 확인
    const existingReservation =
      await this.reservationsRepository.findBySitterIdAndDate(sitterId, date);

    if (existingReservation) {
      throw new HttpError.BadRequest(MESSAGES.RESERVATIONS.CREATE.DUPLICATE);
    }

    // 현재 날짜와 예약 날짜 비교
    const currentDate = new Date();
    const reservationDate = new Date(date);

    if (currentDate > reservationDate) {
      throw new HttpError.BadRequest(MESSAGES.RESERVATIONS.CREATE.INVALID_DATE);
    }

    const data = await this.reservationsRepository.create(
      sitterId,
      userId,
      date,
      service,
    );

    return data;
  };

  /** 예약 목록 조회 API **/
  readMany = async (userId, sort) => {
    const data = await this.reservationsRepository.readMany(userId, sort);

    return data;
  };

  //예약 상세조회//
  reservationReadOne = async (id) => {
    let data = await this.reservationsRepository.reservationReadOne(id);
    if (!data) {
      throw new HttpError.NotFound(
        MESSAGES.RESERVATIONS.READ.IS_NOT_RESERVATION,
      );
    }

    return data;
  };

  updateReservation = async (id, sitterId, date, service) => {
    const existReservation = await this.reservationsRepository.findById(id);
    //있는 예약인지 확인하기 : service

    ///////
    if (existReservation) {
      //아래에 넣을 내용 HttpError.
      throw new HttpError.Conflict(MESSAGES.RESERVATIONS.UPDATE.IS_RESERVATION);
    }

    //   const parseDate = this.parseDate
    //날짜파싱하는 함수.......ㅠㅠㅠㅠ
    // update
    const updatedReservation =
      await this.reservationsRepository.updateReservation(
        parseInt(id),
        parseInt(sitterId),
        new Date(date),
        service,
      );

    console.log(updatedReservation);
    return updatedReservation;
  };

  /** 예약 삭제 API **/
  delete = async (id) => {
    // 존재하는 예약인지 확인
    const existedReservation = await this.reservationsRepository.findById(id);

    if (!existedReservation) {
      throw new HttpError.NotFound(MESSAGES.RESERVATIONS.COMMON.NOT_FOUND);
    }

    const data = await this.reservationsRepository.delete(id);

    return data;
  };
}
