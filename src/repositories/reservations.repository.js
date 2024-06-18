import { prisma } from '../utils/prisma.utils.js';

export class ReservationsRepository {
  findById = async (id) => {
    const existReservation = await prisma.reservation.findFirst({
      where: {
        id,
      },
    });
    return existReservation;
  };

  // };
  // gogo = async (id, sitterId, date, service) => {
  updateReservation = async (id, sitterId, date, service) => {
    const updatedReservation = await prisma.reservation.update({
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
