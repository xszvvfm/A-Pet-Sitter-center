import { prisma } from '../utils/prisma.utils.js';

export class ReservationsRepository {
  /** 예약 생성 API **/
  create = async (sitterId, userId, date, service) => {
    const data = await prisma.reservation.create({
      data: {
        sitterId: +sitterId,
        userId: +userId,
        date: new Date(date),
        service,
      },
    });

    return data;
  };

  /** 예약 목록 조회 API **/
  readMany = async (userId, sort) => {
    let data = await prisma.reservation.findMany({
      where: {
        userId: +userId,
      },
      orderBy: {
        createdAt: sort,
      },
    });

    data = data.map((reservation) => {
      return {
        reserveId: reservation.id,
        userId: reservation.userId,
        sitterId: reservation.sitterId,
        date: reservation.date,
        serviceType: reservation.service,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt,
      };
    });

    return data;
  };

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

  /** 예약 삭제 API **/
  delete = async (userId, reserveId) => {
    // const existedReservation = await prisma.reservation.findUnique({
    //   where: { userId: +userId, id: +reserveId },
    // });

    const data = await prisma.reservation.delete({
      where: { userId: +userId, id: +reserveId },
    });

    return data;
  };
}
