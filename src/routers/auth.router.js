import express from 'express'
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt'

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
        const accessToken = await genera
    } catch (error) {
        next(error)
    }
})

export {authRouter};