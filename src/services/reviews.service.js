// src/services/review.service.js
import { HttpError } from '../errors/http.error.js';

export class ReviewService {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  createReview = async (userId, comment, rating, reserveId) => {
    if (!comment || !rating || !reserveId) {
      throw new HttpError.BadRequest('comment, rating, reserveId는 필수 입력사항입니다.');
    }

    const reservation = await this.reviewRepository.getReservationById(reserveId);

    if (!reservation) {
      throw new HttpError.NotFound('해당 예약을 찾을 수 없습니다.');
    }

    if (reservation.userId !== userId) {
      throw new HttpError.Forbidden('해당 예약에 대한 리뷰를 작성할 권한이 없습니다.');
    }

    const sitterId = reservation.sitterId; // 예약 정보에서 sitterId 가져오기
    const date = new Date(reservation.date.toISOString().split('T')[0]);

    const existingReview = await this.reviewRepository.findExistingReview(userId, sitterId, date);

    if (existingReview) {
      throw new HttpError.Conflict('이미 리뷰를 작성하였습니다.');
    }

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
        likes: review.likes,
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
      likes: review.likes,
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
    const reviews = await this.reviewRepository.getReviewsBySitterId(sitterId);

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
          likes: review.likes,
        })),
      }
    };
  };

  updateReview = async (userId, reviewId, re_comment, re_rating) => {
    if (!re_comment && !re_rating) {
      throw new HttpError.BadRequest('re_comment 또는 re_rating 중 하나는 필수 입력사항입니다.');
    }

    const review = await this.reviewRepository.getReviewById(reviewId);

    if (!review) {
      throw new HttpError.NotFound('리뷰를 찾을 수 없습니다.');
    }

    if (review.userId !== userId) {
      throw new HttpError.Forbidden('본인의 리뷰만 수정할 수 있습니다.');
    }

    const data = {};
    if (re_comment) data.comment = re_comment;
    if (re_rating) data.rating = parseInt(re_rating, 10);
    data.updatedAt = new Date();

    const updatedReview = await this.reviewRepository.updateReview(reviewId, data);

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
      }
    };
  };

  deleteReview = async (userId, reviewId) => {
    const review = await this.reviewRepository.getReviewById(reviewId);

    if (!review) {
      throw new HttpError.NotFound('리뷰를 찾을 수 없습니다.');
    }

    if (review.userId !== userId) {
      throw new HttpError.Forbidden('본인의 리뷰만 삭제할 수 있습니다.');
    }

    await this.reviewRepository.deleteReview(reviewId);

    return { status: 200, data: { message: '리뷰가 삭제되었습니다.' } };
  };

  likeReview = async (userId, reviewId) => {
    const review = await this.reviewRepository.getReviewById(reviewId);

    if (!review) {
      throw new HttpError.NotFound('좋아요를 누를 리뷰가 존재하지 않습니다.');
    }

    const existingLike = await this.reviewRepository.findReviewLike(userId, reviewId);

    if (existingLike) {
      await this.reviewRepository.deleteReviewLike(existingLike.id);
      await this.reviewRepository.decrementLikes(reviewId);
      return { status: 200, data: { message: '좋아요를 취소했습니다.' } };
    } else {
      await this.reviewRepository.createReviewLike(userId, reviewId);
      await this.reviewRepository.incrementLikes(reviewId);
      return { status: 200, data: { message: '좋아요를 눌렀습니다.' } };
    }
  };
}
