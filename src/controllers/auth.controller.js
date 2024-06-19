import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export class AuthController {
    //회원가입
    SignUp = async (req, res, next) => {
        try {
          const { email, password, passwordConfirm, username } = req.body;
         //service
         const data = await authService.SignUp({email, password, passwordConfirm, username})   
         
         return res.status(HTTP_STATUS.CREATED).json({
            status: HTTP_STATUS.CREATED,
            message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
            data,
        });
        } catch (error) {
          next(error);
        }
      }
    //로그인
    SignIn = async (req, res, next) => {
        try {
          const { email, password } = req.body;
          const data = await authService.SignIn({email, password})
          return res
            .status(HTTP_STATUS.OK)
            .json({ status: HTTP_STATUS.OK, message: MESSAGES.AUTH.SIGN_IN.SUCCEED, data });
        } catch (error) {
          next(error);
        }
      }
    // 토큰 재발급
    Token = async (req, res, next) => {
        try {
          const user = req.user;
          const data = await authService.Token(user)
      
          return res
            .status(HTTP_STATUS.OK)
            .json({
                 status: HTTP_STATUS.OK, 
                 message: MESSAGES.AUTH.TOKEN.SUCCEED, 
                 data });
        } catch (error) {
          next(error);
        }
      }

    //로그아웃
    SignOut = async (req, res, next) => {
        try {
          const user = req.user;
          const data = await authService.SignOut(user)
          return res
            .status(HTTP_STATUS.OK)
            .json({
              status: HTTP_STATUS.OK,
              message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
              data,
            });
        } catch (error) {
          next(error);
        }
      }

}