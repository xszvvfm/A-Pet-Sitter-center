// src/repositories/review.repository.js

// ReviewRepository 클래스는 Prisma ORM을 사용하여 리뷰와 관련된 데이터베이스 작업을 수행
export class ReviewRepository {
  // 생성자 함수에서는 Prisma 인스턴스를 주입
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 예약 ID 예약 정보 조회 메서드
  getReservationById = async (id) => {
    return await this.prisma.reservation.findUnique({
      where: { id: parseInt(id, 10) }, // 예약 ID를 정수로 변환하여 조회
    });
  };

  // 특정 유저가 특정 펫시터에게 특정 날짜에 작성한 기존 리뷰 조회 메서드
  findExistingReview = async (userId, sitterId, date) => {
    return await this.prisma.review.findFirst({
      where: {
        userId,
        sitterId,
        date,
      },
    });
  };

  // 새로운 리뷰를 생성하는 메서드
  createReview = async (reviewData) => {
    return await this.prisma.review.create({
      data: reviewData, // 리뷰 데이터를 전달하여 생성
    });
  };

  // 특정 유저의 리뷰 목록을 조회하는 메서드
  getReviewsByUserId = async (userId) => {
    return await this.prisma.review.findMany({
      where: { userId }, // 유저 ID로 리뷰 조회
      include: {
        petSitter: true, // 펫시터 정보 포함
        user: true, // 유저 정보 포함
        reservation: true, // 예약 정보 포함
      },
      orderBy: {
        date: 'desc', // 날짜 내림차순 정렬
      },
    });
  };

  // 특정 펫시터의 리뷰 목록을 조회하는 메서드
  getReviewsBySitterId = async (sitterId) => {
    return await this.prisma.review.findMany({
      where: { sitterId }, // 펫시터 ID로 리뷰 조회
      include: {
        petSitter: true, // 펫시터 정보 포함
        user: true, // 유저 정보 포함
        reservation: true, // 예약 정보 포함
      },
      orderBy: {
        id: 'desc', // ID 내림차순 정렬
      },
    });
  };

  // 리뷰 ID로 특정 리뷰를 조회하는 메서드
  getReviewById = async (reviewId) => {
    return await this.prisma.review.findUnique({
      where: { id: parseInt(reviewId, 10) }, // 리뷰 ID를 정수로 변환하여 조회
      include: {
        reservation: true, // 예약 정보 포함
      },
    });
  };

  // 리뷰를 업데이트하는 메서드
  updateReview = async (reviewId, data) => {
    return await this.prisma.review.update({
      where: { id: parseInt(reviewId, 10) }, // 리뷰 ID를 정수로 변환하여 조회
      data, // 업데이트할 데이터
      include: {
        reservation: true, // 예약 정보 포함
      },
    });
  };

  // 리뷰를 삭제하는 메서드
  deleteReview = async (reviewId) => {
    return await this.prisma.review.delete({
      where: { id: parseInt(reviewId, 10) }, // 리뷰 ID를 정수로 변환하여 삭제
    });
  };

  // 리뷰에 좋아요를 추가하는 메서드
  createReviewLike = async (userId, reviewId) => {
    return await this.prisma.reviewLike.create({
      data: {
        userId, // 유저 ID
        reviewId, // 리뷰 ID
      },
    });
  };

  // 특정 유저가 특정 리뷰에 좋아요를 눌렀는지 확인하는 메서드
  findReviewLike = async (userId, reviewId) => {
    return await this.prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId, // 유저 ID
          reviewId, // 리뷰 ID
        },
      },
    });
  };

  // 리뷰 좋아요를 삭제하는 메서드
  deleteReviewLike = async (likeId) => {
    return await this.prisma.reviewLike.delete({
      where: { id: likeId }, // 좋아요 ID로 삭제
    });
  };

  // 리뷰의 좋아요 수를 증가시키는 메서드
  incrementLikes = async (reviewId) => {
    return await this.prisma.review.update({
      where: { id: parseInt(reviewId, 10) }, // 리뷰 ID를 정수로 변환하여 조회
      data: {
        likes: { increment: 1 }, // 좋아요 수 증가
      },
    });
  };

  // 리뷰의 좋아요 수를 감소시키는 메서드
  decrementLikes = async (reviewId) => {
    return await this.prisma.review.update({
      where: { id: parseInt(reviewId, 10) }, // 리뷰 ID를 정수로 변환하여 조회
      data: {
        likes: { decrement: 1 }, // 좋아요 수 감소
      },
    });
  };
}
