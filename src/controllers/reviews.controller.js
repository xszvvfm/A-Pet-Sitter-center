// src/controllers/review.controller.js
export class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }

  createReview = async (req, res, next) => {
    const { sitterId } = req.params;
    const { comment, rating, reservationId } = req.body;
    const userId = req.user.id;

    try {
      const result = await this.reviewService.createReview(userId, sitterId, comment, rating, reservationId);
      return res.status(result.status).json(result.data || { error: result.message });
    } catch (error) {
      next(error);
    }
  };

  getUserReviews = async (req, res, next) => {
    const userId = req.user.id;

    try {
      const result = await this.reviewService.getUserReviews(userId);
      return res.status(result.status).json(result.data || { error: result.message });
    } catch (error) {
      next(error);
    }
  };

  getSitterReviews = async (req, res, next) => {
    const { sitterId } = req.params;

    try {
      const result = await this.reviewService.getSitterReviews(sitterId);
      return res.status(result.status).json(result.data || { error: result.message });
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req, res, next) => {
    const { sitterId, reviewId } = req.params;
    const { re_comment, re_rating } = req.body;
    const userId = req.user.id;

    try {
      const result = await this.reviewService.updateReview(userId, sitterId, reviewId, re_comment, re_rating);
      return res.status(result.status).json(result.data || { error: result.message });
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req, res, next) => {
    const { sitterId, reviewId } = req.params;
    const userId = req.user.id;

    try {
      const result = await this.reviewService.deleteReview(userId, sitterId, reviewId);
      return res.status(result.status).json(result.data || { error: result.message });
    } catch (error) {
      next(error);
    }
  };
}
