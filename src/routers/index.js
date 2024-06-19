import express from 'express';
import { authRouter } from './auth.router.js';
import { reservationsRouter } from './reservationsRouter.js';
import { reviewsRouter } from './reviews.router.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { petsitters } from './petsitter.router.js';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/reservations', requireAccessToken, reservationsRouter);
apiRouter.use('/', reviewsRouter, petsitters);

export { apiRouter };
