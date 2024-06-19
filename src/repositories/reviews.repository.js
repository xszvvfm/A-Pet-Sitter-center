// src/repositories/review.repository.js
export class ReviewRepository {
    constructor(prisma) {
      this.prisma = prisma;
    }
  
    getReservationById = async (reservationId) => {
      return await this.prisma.reservation.findUnique({
        where: { id: parseInt(reservationId, 10) },
        include: { petSitter: true },
      });
    };
  
    findExistingReview = async (userId, sitterId, date) => {
      return await this.prisma.review.findFirst({
        where: {
          userId: userId,
          sitterId: parseInt(sitterId, 10),
          date: date,
        },
      });
    };
  
    createReview = async (data) => {
      return await this.prisma.review.create({ data });
    };
  
    getReviewsByUserId = async (userId) => {
      return await this.prisma.review.findMany({
        where: { userId: userId },
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
        where: { sitterId: parseInt(sitterId, 10) },
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
        data: data,
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
  