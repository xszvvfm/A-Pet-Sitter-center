import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

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

  updateReservation = async (id, sitterId, date, service, userId) => {
    const existReservation = await this.reservationsRepository.findById(id);
    //있는 예약인지 확인하기 : service

    if (!existReservation) {
      //아래에 넣을 내용 HttpError.
      throw new HttpError.Conflict(MESSAGES.RESERVATIONS.UPDATE.IS_RESERVATION);
    }

    const alreadyReservation =
      await this.reservationsRepository.findReservationBySitterIdAndDate(
        sitterId,
        date,
      );

    //서비스
    //alreadyReservation 이 null 이면 해당 날짜에 예약이 없는 것=> 예약가능하게
    const isMyReservation =
      userId === alreadyReservation?.userId && id === alreadyReservation?.id;
    //안되는 경우 먼저 거르기
    if (alreadyReservation && !isMyReservation) {
      throw new HttpError.Conflict('이미 예약된 정보입니다.');
    }

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
