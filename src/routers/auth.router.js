import express from 'express';
import { prisma } from '../utils/prisma.utils.js';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
const authRouter = express.Router();

const usersRepository = new UsersRepository(prisma);
const authService = new AuthService(usersRepository);
const authController = new AuthController(authService);

//회원가입
authRouter.post('/sign-up', signUpValidator, authController.SignUp);

//로그인
authRouter.post('/sign-in', signInValidator, authController.SignIn);
// 토큰 재발급
authRouter.post('/token', requireRefreshToken, authController.Token);

//로그아웃
authRouter.post('/sign-out', requireRefreshToken, authController.SignOut);

export { authRouter };
