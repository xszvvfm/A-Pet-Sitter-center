import express from 'express';
import { prisma } from '../utils/prisma.utils.js';


const petsitters = express.Router();

petsitters.get('/petsitters', async (req, res) => {
  const { sort, region, experience, name } = req.query;

  try {
    const queryOptions = {
      where: {},
      orderBy: {},
    };

    if (region) {
      queryOptions.where.region = region;
    }

    if (experience) {
      queryOptions.where.experience = parseInt(experience, 10);
    }

    if (name) {
      queryOptions.where.name = {
        contains: name,
      };
    }

    if (sort) {
      const [field, order] = sort.split('_');
      queryOptions.orderBy[field] = order;
    }

    const petSitters = await prisma.petSitter.findMany(queryOptions);

    if (petSitters.length === 0) {
      return res.status(404).json({
        status: 404,
        message: '검색 조건에 해당하는 펫시터가 없습니다.',
      });
    }

    const response = petSitters.map(sitter => ({
      sitter_id: sitter.id,
      name: sitter.name,
      experience: sitter.experience,
      region: sitter.region,
    }));

    res.status(200).json({
      status: 200,
      message: '펫시터들 목록조회에 성공했습니다.',
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: '서버 오류가 발생했습니다.',
      error: error.message,
    });
  }
});



//펫시터 상세조회(+예약가능날짜조회)
petsitters.get('/petsitters/:sitterId/date', async (req, res) => {
  const { sitterId } = req.params;

  try {
    // 펫시터의 정보를 조회
    const petSitter = await prisma.petSitter.findUnique({
      where: {
        id: parseInt(sitterId, 10),
      },
    });

    if (!petSitter) {
      return res.status(404).json({
        status: 404,
        message: '펫시터를 찾을 수 없습니다.',
      });
    }

    // 해당 펫시터의 모든 예약을 조회
    const reservations = await prisma.reservation.findMany({
      where: {
        sitterId: parseInt(sitterId, 10),
      },
      select: {
        date: true,
      },
    });

    // 예약된 날짜 배열 생성
    const reservedDates = reservations.map(reservation => reservation.date.toISOString().split('T')[0]);

    // 현재 날짜로부터 하루 뒤부터 앞으로 10일간의 날짜 생성
    const currentDate = new Date();
    const availableDates = [];

    for (let i = 1; i <= 10; i++) { // 1일부터 시작하도록 변경
      const nextDate = new Date();
      nextDate.setDate(currentDate.getDate() + i);
      const dateString = nextDate.toISOString().split('T')[0];

      // 예약된 날짜에 포함되지 않은 날짜만 추가
      if (!reservedDates.includes(dateString)) {
        availableDates.push(dateString);
      }
    }

    res.status(200).json({
      status: 200,
      message: '예약 가능한 날짜 조회에 성공했습니다.',
      data: {
        sitter_id: petSitter.id,
        name: petSitter.name,
        experience: petSitter.experience,
        region: petSitter.region,
        availableDates: availableDates,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: '서버 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

export { petsitters };
