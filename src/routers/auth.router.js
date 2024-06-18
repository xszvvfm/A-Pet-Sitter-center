import express from 'express'
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} from '../constants/env.constants.js';

const prisma = new PrismaClient();

const authRouter =express();

//회원가입
authRouter.post('/sign-up', async(req, res, next) => {
    try{const { email, password, passwordConfirm, username } = req.body;
    const existedUser = await prisma.user.findUnique({
        where :{email}
    })
    if(existedUser) {
        res.status(400).json({message:"이미 가입 된 사용자입니다."})
        return
    }
    if(password !== passwordConfirm) {
        res.status(400).json({message:"비밀번호 값이 일치하지 않습니다."})
        return
    }
    const hassedPassword = bcrypt.hashSync( password, 10)
    const {_password, ...user} = await prisma.user.create({
        data: {
            email,
            password: hassedPassword,
            username
        }
    });
    res.status(201).json({status: 200, message:"회원가입에 성공했습니다."})

} catch (error) {
    next(error)
}});

//로그인
authRouter.post('/sign-in', async(req, res, next) => {
    try{
        const {email, password} = req.body
        const user = await prisma.user.findUnique({
            where:{email}
        })
        if(!user) {
            res.status(400).json({message:"가입되지 않은 이메일입니다."})
            return
        }
        const passwordCheck = bcrypt.compareSync(password, user.password);
        if(!passwordCheck) {
            res.status(400).json({message:"비밀번호를 확인해주세요."})
            return
        }
        const payload = {id: user.id};
        const data = await generateAuthTokens(payload);
        return res.status(200).json({status:200, message: "로그인에 성공하였습니다.",data})
    } catch (error) {
        next(error);
    }
})
// 토큰 재발급
authRouter.post('/token', async(req, res, next) => {
    try{
        const user = req.user;
        const payload = {id: user.id}
        const data = await generateAuthTokens(payload);

        return res.status(200).json({status:200,message:"토큰이 발급되었습니다",data})
    } catch (error) {
        next(error)
    }
})

//로그아웃
authRouter.post('/sign-out', async(req, res, next) => {
    try{
        const user = req.user
        await prisma.refreshToken.update({
            where: { userId: user.id},
            data : { refreshToken: null }
        });
        return res.status(200).json({status:200, message:"로그아웃 하였습니다.", data: {id: user.id}})
    } catch(error) {
        next(error)
    }
})

//토큰생성 함수
const generateAuthTokens = async (payload) => {
    const userId = payload.id;
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: '12h'
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET,{
        expiresIn: '7d'
    })
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10)

    //refreshtoken 생성하거나 갱신
    await prisma.refreshToken.upsert({
        where: {
            userId,
        },
        update: {
            refreshToken: hashedRefreshToken,
        },
        create: {
            userId,
            refreshToken: hashedRefreshToken,
        }
    });
    return {accessToken, refreshToken};
}

export {authRouter};