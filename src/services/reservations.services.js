import { ReservationsRepository } from '../repositories/reservations.repository.js';
import { HttpError } from '../errors/httperror.js';
import { MESSAGES } from '../constants/messages.const.js';

export class ReservationsService {
  reservationsRepository = new ReservationsRepository();

  updateReservation = async (id, sitterId, date, service) => {
    const existReservation = await this.reservationsRepository.findById(id);
    //있는 예약인지 확인하기 : service

    ///////
    if (!existReservation) {
      //아래에 넣을 내용 HttpError.
      throw new HttpError.Conflict(
        MESSAGES.RESERVATION.READ.IS_NOT_RESERVATION,
      );
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
    return updatedReservation;
  };
}
