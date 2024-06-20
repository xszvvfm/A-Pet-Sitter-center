// import { prisma } from '../utils/prisma.utils.js';

export class ReservationsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  /** 예약 생성 API **/
  create = async (sitterId, userId, date, service) => {
    const data = await this.prisma.reservation.create({
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
    let data = await this.prisma.reservation.findMany({
      where: {
        userId: +userId,
      },
      orderBy: {
        createdAt: sort,
      },
    });

    data = data.map((reservation) => {
      return {
        id: reservation.id,
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

  //상세조회
  reservationReadOne = async (id) => {
    let data = await this.prisma.reservation.findFirst({
      where: { id: +id },
    });
    data = {
      userId: data.userId,
      sitterId: data.sitterId,
      reserveId: data.reserveId,
      date: data.date,
      serviceType: data.service,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return data;
  };

  //수정
  findById = async (id) => {
    const existReservation = await this.prisma.reservation.findFirst({
      where: {
        id,
      },
    });
    return existReservation;
  };

  /** 펫시터 조회 API **/
  findBySitterId = async (sitterId) => {
    console.log(sitterId);
    const existSitter = await this.prisma.petSitter.findUnique({
      where: { id: +sitterId },
    });
    return existSitter;
  };

  /** 동일한 펫시터와 날짜로 이미 예약이 있는지 확인 **/
  findReservationBySitterIdAndDate = async (sitterId, date) => {
    return await this.prisma.reservation.findUnique({
      where: {
        sitterId_date: {
          sitterId: +sitterId,
          date: new Date(date),
        },
      },
    });
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

  /** 예약 삭제 API **/
  delete = async (userId, id) => {
    // const existedReservation = await prisma.reservation.findUnique({
    //   where: { userId: +userId, id: +reserveId },
    // });

    const data = await this.prisma.reservation.delete({
      where: { userId: +userId, id: +id },
    });

    return data;
  };
}
