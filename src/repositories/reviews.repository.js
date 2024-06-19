// src/repositories/review.repository.js
export class ReviewRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  getReservationById = async (id) => {
    return await this.prisma.reservation.findUnique({
      where: { id: parseInt(id, 10) },
    });
  };

  findExistingReview = async (userId, sitterId, date) => {
    return await this.prisma.review.findFirst({
      where: {
        userId,
        sitterId,
        date,
      },
    });
  };

  createReview = async (reviewData) => {
    return await this.prisma.review.create({
      data: reviewData,
    });
  };

  getReviewsByUserId = async (userId) => {
    return await this.prisma.review.findMany({
      where: { userId },
      include: {
        petSitter: true,
        user: true,
        reservation: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  };

  getReviewsBySitterId = async (sitterId) => {
    return await this.prisma.review.findMany({
      where: { sitterId },
      include: {
        petSitter: true,
        user: true,
        reservation: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  };

  getReviewById = async (reviewId) => {
    return await this.prisma.review.findUnique({
      where: { id: parseInt(reviewId, 10) },
      include: {
        reservation: true,
      },
    });
  };

  updateReview = async (reviewId, data) => {
    return await this.prisma.review.update({
      where: { id: parseInt(reviewId, 10) },
      data,
      include: {
        reservation: true,
      },
    });
  };

  deleteReview = async (reviewId) => {
    return await this.prisma.review.delete({
      where: { id: parseInt(reviewId, 10) },
    });
  };
}
