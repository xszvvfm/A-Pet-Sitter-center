import express from 'express';
import { reservationRouter } from './reservations.router.js';
// import { usersRouter } from './users.router.js';
// import { resumesRouter } from './resumes.router.js';
// import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const apiRouter = express.Router();

apiRouter.use('/reservations', reservationRouter);
// apiRouter.use('/users', usersRouter);
// apiRouter.use('/resumes', requireAccessToken, resumesRouter);

export { apiRouter };
