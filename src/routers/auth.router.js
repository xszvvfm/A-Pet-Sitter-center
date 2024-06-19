import express from 'express';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';
//import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
//import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { AuthController } from '../controllers/auth.controller.js';
const authRouter = express.Router();

const authController = new AuthController();

//회원가입
authRouter.post('/sign-up', authController.SignUp)

//로그인
authRouter.post('/sign-in', authController.SignIn);
// 토큰 재발급
authRouter.post('/token', requireRefreshToken, authController.Token);

//로그아웃
authRouter.post('/sign-out', requireRefreshToken, authController.SignOut);

export { authRouter };
