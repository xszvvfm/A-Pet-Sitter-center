// src/controllers/review.controller.js

// ReviewController 클래스는 리뷰와 관련된 API 요청을 처리
export class ReviewController {
  // 생성자 함수에서는 reviewService를 주입
  constructor(reviewService) {
    this.reviewService = reviewService;
  }

  // 리뷰를 생성 메서드
  createReview = async (req, res, next) => {
    // 요청 본문에서 리뷰 내용, 평점, 예약 ID를 추출
    const { comment, rating, reserveId } = req.body;
    // 요청 유저의 ID를 추출
    const userId = req.user.id;

    try {
      // reviewService를 사용하여 리뷰를 생성
      const result = await this.reviewService.createReview(userId, comment, rating, reserveId);
      // 결과에 따라 적절한 응답을 반환
      return res.status(result.status).json(result.data || { error: result.message });
    } catch (error) {
      // 에러가 발생한 경우 next 함수를 호출하여 에러 미들웨어로 전달
      next(error);
    }
  };

  // 유저의 리뷰 목록 조회 메서드
  getUserReviews = async (req, res, next) => {
    // 요청 유저의 ID를 추출
    const userId = req.user.id;

    try {
      // reviewService를 사용하여 유저의 리뷰 목록을 조회
      const result = await this.reviewService.getUserReviews(userId);
      // 결과에 따라 적절한 응답을 반환
      return res.status(result.status).json(result.data || { error: result.message });
    } catch (error) {
      // 에러가 발생한 경우 next 함수를 호출하여 에러 미들웨어로 전달
      next(error);
    }
  };

  // 특정 펫시터의 리뷰 목록 조회 메서드
  getSitterReviews = async (req, res, next) => {
    // 요청 파라미터에서 펫시터 ID를 추출
    const { sitterId } = req.params;

    try {
      // reviewService를 사용하여 특정 펫시터의 리뷰 목록을 조회
      const result = await this.reviewService.getSitterReviews(parseInt(sitterId, 10));
      // 결과에 따라 적절한 응답을 반환
      return res.status(result.status).json(result.data || { error: result.message });
    } catch (error) {
      // 에러가 발생한 경우 next 함수를 호출하여 에러 미들웨어로 전달
      next(error);
    }
  };

  // 리뷰 업데이트 메서드
  updateReview = async (req, res, next) => {
    // 요청 파라미터에서 리뷰 ID를 추출
    const { reviewId } = req.params;
    // 요청 본문에서 수정된 리뷰 내용과 평점을 추출
    const { re_comment, re_rating } = req.body;
    // 요청 유저의 ID를 추출
    const userId = req.user.id;

    try {
      // reviewService를 사용하여 리뷰를 업데이트
      const result = await this.reviewService.updateReview(userId, parseInt(reviewId, 10), re_comment, re_rating);
      // 결과에 따라 적절한 응답을 반환
      return res.status(result.status).json(result.data || { error: result.message });
    } catch (error) {
      // 에러가 발생한 경우 next 함수를 호출하여 에러 미들웨어로 전달
      next(error);
    }
  };

  // 리뷰 삭제 메서드
  deleteReview = async (req, res, next) => {
    // 요청 파라미터에서 리뷰 ID를 추출
    const { reviewId } = req.params;
    // 요청 유저의 ID를 추출
    const userId = req.user.id;

    try {
      // reviewService를 사용하여 리뷰를 삭제
      const result = await this.reviewService.deleteReview(userId, parseInt(reviewId, 10));
      // 결과에 따라 적절한 응답을 반환
      return res.status(result.status).json(result.data || { error: result.message });
    } catch (error) {
      // 에러가 발생한 경우 next 함수를 호출하여 에러 미들웨어로 전달
      next(error);
    }
  };

  // 리뷰에 좋아요를 추가하는 메서드
  likeReview = async (req, res, next) => {
    // 요청 파라미터에서 리뷰 ID를 추출
    const { reviewId } = req.params;
    // 요청 유저의 ID를 추출
    const userId = req.user.id;

    try {
      // reviewService를 사용하여 리뷰에 좋아요를 추가
      const result = await this.reviewService.likeReview(userId, parseInt(reviewId, 10));
      // 결과에 따라 적절한 응답을 반환
      return res.status(result.status).json(result.data || { error: result.message });
    } catch (error) {
      // 에러가 발생한 경우 next 함수를 호출하여 에러 미들웨어로 전달
      next(error);
    }
  };
}
