// src/routers/petsitter.router.js
import express from 'express';
import { PetSitterController } from '../controllers/petsitter.controller.js';
import { PetSitterService } from '../services/petsitter.service.js';
import { PetSitterRepository } from '../repositories/petsitter.repository.js';
import { prisma } from '../utils/prisma.utils.js';

const petsitters = express.Router();

const petSitterRepository = new PetSitterRepository(prisma);
const petSitterService = new PetSitterService(petSitterRepository);
const petSitterController = new PetSitterController(petSitterService);

// 펫시터 목록 조회 API
petsitters.get('/petsitters', petSitterController.getPetSitters);

// 펫시터 상세조회(+예약가능날짜조회) API
petsitters.get(
  '/petsitters/:sitterId/date',
  petSitterController.getPetSitterDetails,
);

export { petsitters };
