import express from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { prisma } from '../utils/prisma.utils.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { UserController } from '../controllers/users.controller.js';

const userRouter = express.Router();

const usersRepository = new UsersRepository(prisma);
const userController = new UserController(usersRepository);

//내정보 조회
userRouter.get('/user', requireAccessToken, userController.getUser);

//내정보 수정
userRouter.patch('/user', requireAccessToken, userController.updateUser);

export { userRouter };
