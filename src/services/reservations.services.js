import { reservationsRepository } from '../repositories/reservations.repository.js';

export class reservationService {
  reservationsRepository = new reservationsRepository();

    //
    getReservationById = async(reserveId)
     const data = await this.reservation.findUnique(reserveId);
      if (!data) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: HTTP_STATUS.NOT_FOUND,
          message: MESSAGES.RESERVATION.READ.IS_NOT_RESERVATION,
        });
      }

      return data = {
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
    //
  update = async (id, sitter_id, date, service) => {
    //있는 예약인지 확인하기 : service
    const patchResevation = await this.reservationsRepository.update(
      id,
      sitter_id,
      date,
      service,
    );
    return patchResevation;
  };
}
