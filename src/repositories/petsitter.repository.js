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

  findReviewsBySitterId = async (sitterId) => {
    return await this.prisma.review.findMany({
      where: { sitterId },
      select: { rating: true },
    });
  };

  getProfileImagePath = async (sitterId) => {
    const petSitter = await this.prisma.petSitter.findUnique({
      where: { id: sitterId },
      select: { profileImage: true },
    });
    return petSitter ? petSitter.profileImage : null;
  };

  updateProfileImage = async (sitterId, imagePath) => {
    return await this.prisma.petSitter.update({
      where: { id: sitterId },
      data: { profileImage: imagePath },
      select: { profileImage: true },
    });
  };
}
