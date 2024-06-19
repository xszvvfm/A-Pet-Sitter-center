export class PetSitterRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAll = async (queryOptions) => {
    return await this.prisma.petSitter.findMany(queryOptions);
  };

  findOneById = async (id) => {
    return await this.prisma.petSitter.findUnique({
      where: { id },
    });
  };

  findReservationsBySitterId = async (sitterId) => {
    return await this.prisma.reservation.findMany({
      where: { sitterId },
      select: { date: true },
    });
  };

  findReviewsBySitterId = async (sitterId) => { // 리뷰 조회 메서드 추가
    return await this.prisma.review.findMany({
      where: { sitterId },
      select: { rating: true },
    });
  };
}
