// src/routers/reviews.router.js
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
reviewsRouter.post('/sitters/:sitterId/reviews', requireAccessToken, reviewController.createReview);

// 내가 작성한 리뷰 조회 api
reviewsRouter.get('/reviews/my', requireAccessToken, reviewController.getUserReviews);

// 해당 펫시터의 리뷰 전체 조회 api
reviewsRouter.get('/sitters/:sitterId/reviews', reviewController.getSitterReviews);

// 리뷰 수정 api
reviewsRouter.patch('/sitters/:sitterId/reviews/:reviewId', requireAccessToken, reviewController.updateReview);

// 리뷰 삭제 api
reviewsRouter.delete('/sitters/:sitterId/reviews/:reviewId', requireAccessToken, reviewController.deleteReview);

export { reviewsRouter };
