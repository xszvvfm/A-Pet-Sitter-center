// src/services/review.service.js
import { HttpError } from '../errors/http.error.js';

export class ReviewService {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  createReview = async (userId, sitterId, comment, rating, reserveId) => {
    if (!comment || !rating || !reserveId) {
      throw new HttpError.BadRequest('comment, rating, reserveId는 필수 입력사항입니다.');
    }

    const reservation = await this.reviewRepository.getReservationById(reserveId);

    if (!reservation) {
      throw new HttpError.NotFound('해당 예약을 찾을 수 없습니다.');
    }

    if (reservation.userId !== userId || reservation.sitterId !== parseInt(sitterId, 10)) {
      throw new HttpError.Forbidden('해당 예약에 대한 리뷰를 작성할 권한이 없습니다.');
    }

    const date = new Date(reservation.date.toISOString().split('T')[0]);

    const existingReview = await this.reviewRepository.findExistingReview(userId, parseInt(sitterId, 10), date);

    if (existingReview) {
      throw new HttpError.Conflict('이미 리뷰를 작성하였습니다.');
    }

    const review = await this.reviewRepository.createReview({
      date: date,
      rating: parseInt(rating, 10),
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
      petSitter: { connect: { id: parseInt(sitterId, 10) } },
      user: { connect: { id: userId } },
      reservation: { connect: { id: parseInt(reserveId, 10) } },
    });

    return {
      status: 201,
      data: {
        message: "성공적으로 리뷰작성 되었습니다",
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
      }
    };
  };

  getUserReviews = async (userId) => {
    const reviews = await this.reviewRepository.getReviewsByUserId(userId);

    if (reviews.length === 0) {
      throw new HttpError.NotFound('리뷰를 찾을 수 없습니다.');
    }

    const formattedReviews = reviews.map(review => ({
      date: review.date.toISOString().split('T')[0],
      service_type: review.reservation?.service,
      review_id: review.id,
      sitter_id: review.sitterId,
      user_id: review.userId,
      comment: review.comment,
      rating: review.rating,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
    }));

    return {
      status: 200,
      data: {
        message: '리뷰를 조회했습니다.',
        reviews: formattedReviews,
      }
    };
  };

  getSitterReviews = async (sitterId) => {
    const reviews = await this.reviewRepository.getReviewsBySitterId(parseInt(sitterId, 10));

    if (reviews.length === 0) {
      return {
        status: 200,
        data: {
          message: '해당 펫시터가 존재하지 않거나 작성된 리뷰가 없습니다.',
        }
      };
    }

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
        })),
      }
    };
  };

  updateReview = async (userId, sitterId, reviewId, re_comment, re_rating) => {
    if (!re_comment && !re_rating) {
      throw new HttpError.BadRequest('re_comment 또는 re_rating 중 하나는 필수 입력사항입니다.');
    }

    const review = await this.reviewRepository.getReviewById(parseInt(reviewId, 10));

    if (!review) {
      throw new HttpError.NotFound('리뷰를 찾을 수 없습니다.');
    }

    if (review.sitterId !== parseInt(sitterId, 10) || review.userId !== userId) {
      throw new HttpError.Forbidden('본인의 리뷰만 수정할 수 있습니다.');
    }

    const data = {};
    if (re_comment) data.comment = re_comment;
    if (re_rating) data.rating = parseInt(re_rating, 10);
    data.updatedAt = new Date();

    const updatedReview = await this.reviewRepository.updateReview(parseInt(reviewId, 10), data);

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
      }
    };
  };

  deleteReview = async (userId, sitterId, reviewId) => {
    const review = await this.reviewRepository.getReviewById(parseInt(reviewId, 10));

    if (!review) {
      throw new HttpError.NotFound('리뷰를 찾을 수 없습니다.');
    }

    if (review.sitterId !== parseInt(sitterId, 10)) {
      throw new HttpError.NotFound('해당 펫시터의 리뷰가 없습니다.');
    }

    if (review.userId !== userId) {
      throw new HttpError.Forbidden('본인의 리뷰만 삭제할 수 있습니다.');
    }

    await this.reviewRepository.deleteReview(parseInt(reviewId, 10));

    return { status: 200, data: { message: '리뷰가 삭제되었습니다.' } };
  };
}
