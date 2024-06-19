import { authConstant } from "../constants/auth.constant.js";
import bcrypt from 'bcrypt';

export class UsersRepository {
  constructor(prisma) { 
    this.prisma = prisma;
  }
    create = async({ email, password, username}) => {
        const hassedPassword = bcrypt.hashSync(password, authConstant.HASH_SALT_ROUNDS);
          const { _password, ...user } = await this.prisma.user.create({
            data: {
              email,
              password: hassedPassword,
              username,
            },
            select: {
              id: true,
              email: true,
              username: true,
            },
          });
        return user;
    }

    findUserByEmail = async (email) => {
        const data = await this.prisma.user.findUnique({
            where: { email },
          });
        return data;  
    }

    readOneById = async (id) => {
        const data =  await this.prisma.user.findUnique({
            where: { id },
         
          });
        return data;
    }

    deleteRefreshToken = async(user) => {
        await this.prisma.refreshToken.update({
            where: { userId: user.id },
            data: { token: null },
        });
        return { id: user.id };
    }

    upsertRefreshToken = async (userId, refreshToken) => {
        const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);
        const token = await this.prisma.refreshToken.upsert({
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
      return token;  
    }
}