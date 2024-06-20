// src/services/review.service.js

import { HttpError } from '../errors/http.error.js';

// ReviewService 클래스는 리뷰와 관련된 비즈니스 로직을 처리
export class ReviewService {
  // 생성자 함수에서는 ReviewRepository를 주입
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  // 리뷰를 생성하는 메서드
  createReview = async (userId, comment, rating, reserveId) => {
    // 필수 입력사항이 누락된 경우 BadRequest 에러를 던짐
    if (!comment || !rating || !reserveId) {
      throw new HttpError.BadRequest(
        'comment, rating, reserveId는 필수 입력사항입니다.',
      );
    }

    // 예약 ID로 예약 정보를 조회
    const reservation =
      await this.reviewRepository.getReservationById(reserveId);

    // 예약을 찾을 수 없는 경우 NotFound 에러를 던짐
    if (!reservation) {
      throw new HttpError.NotFound('해당 예약을 찾을 수 없습니다.');
    }

    // 예약의 유저 ID가 요청 유저 ID와 다른 경우 Forbidden 에러를 던짐
    if (reservation.userId !== userId) {
      throw new HttpError.Forbidden(
        '해당 예약에 대한 리뷰를 작성할 권한이 없습니다.',
      );
    }

    // 예약 정보에서 sitterId를 가져옴
    const sitterId = reservation.sitterId;
    // 예약 날짜를 Date 객체로 변환
    const date = new Date(reservation.date.toISOString().split('T')[0]);

    // 기존에 작성된 리뷰가 있는지 확인
    const existingReview = await this.reviewRepository.findExistingReview(
      userId,
      sitterId,
      date,
    );

    // 이미 리뷰가 작성된 경우 Conflict 에러를 던짐
    if (existingReview) {
      throw new HttpError.Conflict('이미 리뷰를 작성하였습니다.');
    }

    // 리뷰 데이터를 생성.
    const review = await this.reviewRepository.createReview({
      date: date,
      rating: parseInt(rating, 10),
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
      petSitter: { connect: { id: sitterId } },
      user: { connect: { id: userId } },
      reservation: { connect: { id: reserveId } },
    });

    // 성공적으로 생성된 리뷰 데이터를 반환
    return {
      status: 201,
      data: {
        message: '성공적으로 리뷰작성 되었습니다',
        date: review.date.toISOString().split('T')[0],
        service_type: reservation.service,
        review_id: review.id,
        sitter_id: review.sitterId,
        user_id: review.userId,
        comment: review.comment,
        rating: review.rating,
        created_at: review.createdAt,
        updated_at: review.updatedAt,
        reservation_id: review.reservationId,
        likes: review.likes,
      },
    };
  };

  // 유저의 리뷰 목록을 조회하는 메서드
  getUserReviews = async (userId) => {
    // 유저 ID로 리뷰 목록을 조회
    const reviews = await this.reviewRepository.getReviewsByUserId(userId);

    // 리뷰가 없는 경우 NotFound 에러를 던짐
    if (reviews.length === 0) {
      throw new HttpError.NotFound('리뷰를 찾을 수 없습니다.');
    }

    // 리뷰 데이터를 형식에 맞게 변환
    const formattedReviews = reviews.map((review) => ({
      date: review.date.toISOString().split('T')[0],
      service_type: review.reservation?.service,
      review_id: review.id,
      sitter_id: review.sitterId,
      user_id: review.userId,
      comment: review.comment,
      rating: review.rating,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
      likes: review.likes,
    }));

    // 성공적으로 조회된 리뷰 데이터를 반환
    return {
      status: 200,
      data: {
        message: '리뷰를 조회했습니다.',
        reviews: formattedReviews,
      },
    };
  };

  // 특정 펫시터의 리뷰 목록을 조회하는 메서드
  getSitterReviews = async (sitterId) => {
    // 펫시터 ID로 리뷰 목록을 조회.
    const reviews = await this.reviewRepository.getReviewsBySitterId(sitterId);

    // 리뷰가 없는 경우 적절한 메시지를 반환
    if (reviews.length === 0) {
      return {
        status: 200,
        data: {
          message: '해당 펫시터가 존재하지 않거나 작성된 리뷰가 없습니다.',
        },
      };
    }

    // 성공적으로 조회된 리뷰 데이터를 반환
    return {
      status: 200,
      data: {
        message: '리뷰 목록을 조회했습니다.',
        reviews: reviews.map((review) => ({
          date: review.date.toISOString().split('T')[0],
          service_type: review.reservation?.service,
          review_id: review.id,
          sitter_id: review.sitterId,
          user_id: review.userId,
          comment: review.comment,
          rating: review.rating,
          created_at: review.createdAt,
          updated_at: review.updatedAt,
          likes: review.likes,
        })),
      },
    };
  };

  // 리뷰 수정 메서드
  updateReview = async (userId, reviewId, re_comment, re_rating) => {
    // 수정할 데이터가 없는 경우 BadRequest 에러를 던짐
    if (!re_comment && !re_rating) {
      throw new HttpError.BadRequest(
        're_comment 또는 re_rating 중 하나는 필수 입력사항입니다.',
      );
    }

    // 리뷰 ID로 리뷰를 조회.
    const review = await this.reviewRepository.getReviewById(reviewId);

    // 리뷰를 찾을 수 없는 경우 NotFound 에러를 던짐
    if (!review) {
      throw new HttpError.NotFound('리뷰를 찾을 수 없습니다.');
    }

    // 리뷰 작성자가 아닌 경우 Forbidden 에러를 던짐
    if (review.userId !== userId) {
      throw new HttpError.Forbidden('본인의 리뷰만 수정할 수 있습니다.');
    }

    // 업데이트할 데이터를 준비
    const data = {};
    if (re_comment) data.comment = re_comment;
    if (re_rating) data.rating = parseInt(re_rating, 10);
    data.updatedAt = new Date();

    // 리뷰 업데이트
    const updatedReview = await this.reviewRepository.updateReview(
      reviewId,
      data,
    );

    // 성공적으로 업데이트된 리뷰 데이터를 반환
    return {
      status: 200,
      data: {
        message: '리뷰가 성공적으로 수정되었습니다',
        date: updatedReview.reservation.date.toISOString().split('T')[0],
        service_type: updatedReview.reservation.service,
        review_id: updatedReview.id,
        sitter_id: updatedReview.sitterId,
        user_id: updatedReview.userId,
        rating: updatedReview.rating,
        comment: updatedReview.comment,
        created_at: updatedReview.createdAt,
        updated_at: updatedReview.updatedAt,
        likes: updatedReview.likes,
      },
    };
  };

  // 리뷰를 삭제하는 메서드
  deleteReview = async (userId, reviewId) => {
    // 리뷰 ID로 리뷰를 조회
    const review = await this.reviewRepository.getReviewById(reviewId);

    // 리뷰를 찾을 수 없는 경우 NotFound 에러를 던짐
    if (!review) {
      throw new HttpError.NotFound('리뷰를 찾을 수 없습니다.');
    }

    // 리뷰 작성자가 아닌 경우 Forbidden 에러를 던짐
    if (review.userId !== userId) {
      throw new HttpError.Forbidden('본인의 리뷰만 삭제할 수 있습니다.');
    }

    // 리뷰를 삭제
    await this.reviewRepository.deleteReview(reviewId);

    // 성공적으로 삭제된 메시지를 반환
    return { status: 200, data: { message: '리뷰가 삭제되었습니다.' } };
  };

  // 리뷰에 좋아요를 추가하거나 취소하는 메서드
  likeReview = async (userId, reviewId) => {
    // 리뷰 ID로 리뷰를 조회
    const review = await this.reviewRepository.getReviewById(reviewId);

    // 리뷰를 찾을 수 없는 경우 NotFound 에러를 던짐
    if (!review) {
      throw new HttpError.NotFound('좋아요를 누를 리뷰가 존재하지 않습니다.');
    }

    // 유저가 해당 리뷰에 이미 좋아요를 눌렀는지 확인
    const existingLike = await this.reviewRepository.findReviewLike(
      userId,
      reviewId,
    );

    // 이미 좋아요를 눌렀다면 좋아요를 취소
    if (existingLike) {
      await this.reviewRepository.deleteReviewLike(existingLike.id);
      await this.reviewRepository.decrementLikes(reviewId);
      return { status: 200, data: { message: '좋아요를 취소했습니다.' } };
    }
    // 좋아요를 누르지 않았다면 좋아요를 추가
    else {
      await this.reviewRepository.createReviewLike(userId, reviewId);
      await this.reviewRepository.incrementLikes(reviewId);
      return { status: 200, data: { message: '좋아요를 눌렀습니다.' } };
    }
  };
}
