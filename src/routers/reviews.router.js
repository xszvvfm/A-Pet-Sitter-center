import express from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { ReviewController } from '../controllers/reviews.controller.js';
import { ReviewService } from '../services/reviews.service.js';
import { ReviewRepository } from '../repositories/reviews.repository.js';
import { prisma } from '../utils/prisma.utils.js';

const reviewsRouter = express.Router();

const reviewRepository = new ReviewRepository(prisma);
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

// 리뷰 생성 api
reviewsRouter.post('/reviews', requireAccessToken, (req, res, next) =>
  reviewController.createReview(req, res, next),
);

// 내가 작성한 리뷰 조회 api
reviewsRouter.get('/reviews/my', requireAccessToken, (req, res, next) =>
  reviewController.getUserReviews(req, res, next),
);

// 해당 펫시터의 리뷰 전체 조회 api
reviewsRouter.get('/sitters/:sitterId/reviews', (req, res, next) =>
  reviewController.getSitterReviews(req, res, next),
);

// 리뷰 수정 api
reviewsRouter.patch(
  '/reviews/:reviewId',
  requireAccessToken,
  (req, res, next) => reviewController.updateReview(req, res, next),
);

// 리뷰 삭제 api
reviewsRouter.delete(
  '/reviews/:reviewId',
  requireAccessToken,
  (req, res, next) => reviewController.deleteReview(req, res, next),
);

// 리뷰 좋아요 api
reviewsRouter.post(
  '/reviews/:reviewId/likes',
  requireAccessToken,
  (req, res, next) => reviewController.likeReview(req, res, next),
);

export { reviewsRouter };
