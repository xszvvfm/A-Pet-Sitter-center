// src/routers/reviews.router.js
import express from 'express';
import { prisma } from '../utils/prisma.utils.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const reviewsRouter = express.Router();

//리뷰 생성 api(미들웨어추가로 id를 입력받고 예약id를 body로 입력받아 date값을 받아오도록 수정이 필요함)
reviewsRouter.post(
  '/sitters/:sitterId/reviews',
  requireAccessToken,
  async (req, res, next) => {
    const { sitterId } = req.params;
    const { comment, rating, reservationId } = req.body;
    const userId = req.user.id; // 미들웨어에서 가져온 유저 ID

    if (!comment || !rating || !reservationId) {
      return res.status(400).json({
        error: 'comment, rating, reservationId는 필수 입력사항입니다.',
      });
    }

    try {
      // 예약 정보를 가져와서 예약 날짜와 펫시터 ID를 확인
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(reservationId, 10) },
        include: { petSitter: true },
      });

      if (!reservation) {
        return res.status(404).json({ error: '해당 예약을 찾을 수 없습니다.' });
      }

      if (
        reservation.userId !== userId ||
        reservation.sitterId !== parseInt(sitterId, 10)
      ) {
        return res
          .status(403)
          .json({ error: '해당 예약에 대한 리뷰를 작성할 권한이 없습니다.' });
      }

      const date = new Date(reservation.date.toISOString().split('T')[0]); // 예약 날짜 가져오기

      // 동일한 날짜에 동일한 사용자와 펫시터에 대한 리뷰가 있는지 확인
      const existingReview = await prisma.review.findFirst({
        where: {
          userId: userId,
          sitterId: parseInt(sitterId, 10),
          date: date,
        },
      });

      if (existingReview) {
        return res
          .status(400)
          .json({ error: '이미 해당 날짜에 리뷰를 작성하셨습니다.' });
      }

      const review = await prisma.review.create({
        data: {
          date: date,
          rating: parseInt(rating, 10),
          comment,
          createdAt: new Date(),
          updatedAt: new Date(),
          petSitter: {
            connect: { id: parseInt(sitterId, 10) },
          },
          user: {
            connect: { id: userId },
          },
          reservation: {
            connect: { id: parseInt(reservationId, 10) },
          },
        },
      });

      res.status(201).json({
        id: review.id,
        sitterId: review.sitterId,
        userId: review.userId,
        date: review.date.toISOString().split('T')[0], // YYYY-MM-DD 형식으로 반환
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        reservationId: review.reservationId,
      });
    } catch (error) {
      next(error);
    }
  },
);

//내가 작성한 리뷰조회 api
reviewsRouter.get('/reviews/my', requireAccessToken, async (req, res, next) => {
  const userId = req.user.id; // 미들웨어에서 가져온 유저 ID

  try {
    // 사용자 ID로 리뷰를 조회
    const reviews = await prisma.review.findMany({
      where: { userId: userId },
      include: {
        petSitter: true,
        user: true,
      },
    });

    if (reviews.length === 0) {
      return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
    }

    const formattedReviews = reviews.map((review) => ({
      review_id: review.id,
      sitter_id: review.sitterId,
      user_id: review.userId,
      date: review.date.toISOString().split('T')[0], // YYYY-MM-DD 형식으로 변환
      comment: review.comment,
      rating: review.rating,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
    }));

    return res.status(200).json({
      message: '리뷰를 조회했습니다.',
      reviews: formattedReviews,
    });
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
});

//해당펫시터의 리뷰 전체 조회 api
reviewsRouter.get('/sitters/:sitterId/reviews', async (req, res, next) => {
  const { sitterId } = req.params;

  try {
    // 펫시터 ID로 모든 리뷰를 조회
    const reviews = await prisma.review.findMany({
      where: { sitterId: parseInt(sitterId, 10) },
      include: {
        petSitter: true,
        user: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    if (reviews.length === 0) {
      return res.status(200).json({
        message: '해당 펫시터가 존재하지않거나 작성된 리뷰가 없습니다.',
      });
    }

    return res.status(200).json({
      message: '리뷰 목록을 조회했습니다.',
      reviews: reviews.map((review) => ({
        date: review.date.toISOString().split('T')[0], // YYYY-MM-DD 형식으로 변환
        review_id: review.id,
        sitter_id: review.sitterId,
        user_id: review.userId,
        comment: review.comment,
        rating: review.rating,
        created_at: review.createdAt,
        updated_at: review.updatedAt,
      })),
    });
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
});

//리뷰 수정 api(미들웨어에서 엑세스토큰으로 유저id를 받아오도록 수정필요 date를 위해 예약id도 추후 body로 받아오도록 수정필요)

reviewsRouter.patch(
  '/sitters/:sitterId/reviews/:reviewId',
  async (req, res, next) => {
    const { sitterId, reviewId } = req.params;
    const { re_comment, re_rating } = req.body;

    // 나중에 액세스 토큰에서 유저 ID를 가져오도록 수정 필요
    const userId = 2; // 임시 유저 ID

    if (!re_comment && !re_rating) {
      return res.status(400).json({
        error: 're_comment 또는 re_rating 중 하나는 필수 입력사항입니다',
      });
    }

    try {
      // 리뷰 ID로 리뷰를 조회
      const review = await prisma.review.findUnique({
        where: { id: parseInt(reviewId, 10) },
      });

      if (!review) {
        return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
      }

      if (
        review.sitterId !== parseInt(sitterId, 10) ||
        review.userId !== userId
      ) {
        return res
          .status(403)
          .json({ error: '본인의 리뷰만 삭제할 수 있습니다.' });
      }

      // 업데이트할 데이터 객체 생성
      const data = {};
      if (re_comment) data.comment = re_comment;
      if (re_rating) data.rating = parseInt(re_rating, 10);
      data.updatedAt = new Date();

      // 리뷰 업데이트
      const updatedReview = await prisma.review.update({
        where: { id: parseInt(reviewId, 10) },
        data: data,
      });

      return res.status(200).json({
        reserve_id: updatedReview.id,
        sitter_id: updatedReview.sitterId,
        user_id: updatedReview.userId,
        rating: updatedReview.rating,
        comment: updatedReview.comment,
        created_at: updatedReview.createdAt,
        updated_at: updatedReview.updatedAt,
      });
    } catch (error) {
      next(error); // 에러를 핸들러로 전달
    }
  },
);

//리뷰 삭제 api (미들웨어에서 엑세스토큰으로 유저id를 받아오도록 수정필요)
reviewsRouter.delete(
  '/sitters/:sitterId/reviews/:reviewId',
  async (req, res, next) => {
    const { sitterId, reviewId } = req.params;

    // 나중에 액세스 토큰에서 유저 ID를 가져오도록 수정 필요
    const userId = 2; // 임시 유저 ID

    try {
      // 리뷰 ID로 리뷰를 조회
      const review = await prisma.review.findUnique({
        where: { id: parseInt(reviewId, 10) },
      });

      if (!review) {
        return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
      }

      if (
        review.sitterId !== parseInt(sitterId, 10) ||
        review.userId !== userId
      ) {
        return res
          .status(403)
          .json({ error: '본인의 리뷰만 삭제할 수 있습니다' });
      }

      // 리뷰 삭제
      await prisma.review.delete({
        where: { id: parseInt(reviewId, 10) },
      });

      return res.status(200).json({ message: '리뷰가 삭제되었습니다.' });
    } catch (error) {
      next(error); // 에러를 핸들러로 전달
    }
  },
);

export { reviewsRouter };
