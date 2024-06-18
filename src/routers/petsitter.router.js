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

export { petsitters };
