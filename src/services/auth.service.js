import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpError } from "../errors/http.error.js";
import { MESSAGES } from '../constants/message.constant.js';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env.constants.js";
import { UsersRepository } from '../repositories/users.repository.js';

const usersRepository = new UsersRepository();

export class AuthService {
    SignUp = async ({email, password, passwordConfirm, username}) => {
        const existedUser = await usersRepository.findUserByEmail(email);
          if (existedUser) {
            throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED)
          }
          if (password !== passwordConfirm) {
            throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.NOT_MACHTED_PASSWORD)
          }
          const data = await usersRepository.create({email,password,username})
          return data;
    }

    SignIn = async ({email, password}) => {
        const user = await usersRepository.findUserByEmail(email);
          if (!user) {
            throw new HttpError.BadRequest(MESSAGES.AUTH.SIGN_IN.NOT_USER);
          }
          const passwordCheck = bcrypt.compareSync(password, user.password);
          if (!passwordCheck) {
            throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.PASSWORD.NOT_MACHTED);           
          }
          const payload = { id: user.id };
          const data = await this.generateAuthTokens(payload);
          return {data}
    }

    //토큰 재발급
    Token = async (user) => {
        const payload = { id: user.id };
        const tokens = await this.generateAuthTokens(payload);
        return tokens;
    }    

    //로그아웃
    SignOut = async (user) => {
        const data = await usersRepository.deleteRefreshToken(user)
        return data
    }

    //토큰생성 함수 
    generateAuthTokens = async (payload) => {
        const userId = payload.id;
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
          expiresIn: '12h',
        });
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
          expiresIn: '7d',
        });
        await usersRepository.upsertRefreshToken(userId, refreshToken);
        return { accessToken, refreshToken };
      };
}