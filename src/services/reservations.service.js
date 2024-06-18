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
