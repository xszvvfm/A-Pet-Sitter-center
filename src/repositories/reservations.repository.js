// import { prisma } from '../utils/prisma.utils.js';

export class ReservationsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  reservationReadOne = async (id) => {
    let data = await this.prisma.reservation.findFirst({
      where: { id },
    });
    data = {
      user_id: data.userId,
      sitter_id: data.sitterId,
      reserve_id: data.reserveId,
      date: data.date,
      service_type: data.service_type,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };

    // user_id,
    // sitter_id,
    // reserve_id,
    // date,
    // service_type,
    // created_at,
    // updated_at,
    return data;
  };

  findById = async (id) => {
    const existReservation = await this.prisma.reservation.findFirst({
      where: {
        id,
      },
    });
    return existReservation;
  };

  // };
  // gogo = async (id, sitterId, date, service) => {
  updateReservation = async (id, sitterId, date, service) => {
    const updatedReservation = await this.prisma.reservation.update({
      where: {
        id,
      },
      data: {
        ...(sitterId && { sitterId }),
        ...(date && { date }),
        ...(service && { service }),
      },
    });
    return updatedReservation;
  };
}
