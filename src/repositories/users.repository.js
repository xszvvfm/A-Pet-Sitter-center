import { authConstant } from "../constants/auth.constant.js";
import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.utils.js'

export class UsersRepository {
    create = async({ email, password, username}) => {
        const hassedPassword = bcrypt.hashSync(password, authConstant.HASH_SALT_ROUNDS);
          const { _password, ...user } = await prisma.user.create({
            data: {
              email,
              password: hassedPassword,
              username,
            },
           
          });
        return user;
    }

    findUserByEmail = async (email) => {
        const data = await prisma.user.findUnique({
            where: { email },
          });
        return data;  
    }

    readOneById = async (id) => {
        const data =  await prisma.user.findUnique({
            where: { id },
         
          });
        return data;
    }

    deleteRefreshToken = async(user) => {
        await prisma.refreshToken.update({
            where: { userId: user.id },
            data: { token: null },
        });
        return { id: user.id };
    }

    upsertRefreshToken = async (userId, refreshToken) => {
        const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);
        await prisma.refreshToken.upsert({
            where: {
              userId,
            },
            update: {
              token: hashedRefreshToken,
            },
            create: {
              userId,
              token: hashedRefreshToken,
            },
          });
    }
}