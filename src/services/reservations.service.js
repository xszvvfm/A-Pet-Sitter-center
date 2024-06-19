import { ReservationsRepository } from '../repositories/reservations.repository.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';

const reservationsRepository = new ReservationsRepository();

export class ReservationsService {
  /** 예약 생성 API **/
  create = async (sitterId, userId, date, service) => {
    const data = await reservationsRepository.create({
      sitterId,
      userId,
      date,
      service,
    });

    return data;
  };

  /** 예약 목록 조회 API **/
  readMany = async (userId, sort) => {
    const data = await reservationsRepository.readMany({
      userId,
      sort,
    });

    return data;
  };

  // /** 예약 수정 API **/
  // updateReservation = async (id, sitterId, date, service) => {
  //   const existReservation = await this.reservationsRepository.findById(id);
  //   //있는 예약인지 확인하기 : service

  //   ///////
  //   if (!existReservation) {
  //     //아래에 넣을 내용 HttpError.
  //     throw new HttpError.Conflict(
  //       MESSAGES.RESERVATION.READ.IS_NOT_RESERVATION,
  //     );
  //   }

  //   //   const parseDate = this.parseDate
  //   //날짜파싱하는 함수.......ㅠㅠㅠㅠ
  //   // update
  //   const updatedReservation =
  //     await this.reservationsRepository.updateReservation(
  //       parseInt(id),
  //       parseInt(sitterId),
  //       new Date(date),
  //       service,
  //     );
  //   return updatedReservation;
  // };

  /** 예약 삭제 API **/
  delete = async (userId, reserveId) => {
    const existedReservation = await reservationsRepository.delete();

    if (!existedReservation) {
      throw new HttpError.NotFound(MESSAGES.RESERVATIONS.COMMON.NOT_FOUND);
    }

    const data = await reservationsRepository.delete({ userId, reserveId });

    return data;
  };
}
