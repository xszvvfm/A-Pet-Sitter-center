import { HttpError } from '../errors/http.error.js';
import AWS from 'aws-sdk';
import { config } from 'dotenv';
config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export class PetSitterService {
  constructor(petSitterRepository) {
    this.petSitterRepository = petSitterRepository;
  }

  getPetSitters = async (query) => {
    const { sort, region, experience, name } = query;

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

    const petSitters = await this.petSitterRepository.findAll(queryOptions);

    if (petSitters.length === 0) {
      throw new HttpError.NotFound('검색 조건에 해당하는 펫시터가 없습니다.');
    }

    return petSitters.map(sitter => ({
      sitter_id: sitter.id,
      name: sitter.name,
      experience: sitter.experience,
      region: sitter.region,
      profileImage: sitter.profileImage,
    }));
  };

  getPetSitterDetails = async (sitterId) => {
    const petSitter = await this.petSitterRepository.findOneById(parseInt(sitterId, 10));

    if (!petSitter) {
      throw new HttpError.NotFound('펫시터를 찾을 수 없습니다.');
    }

    const reservations = await this.petSitterRepository.findReservationsBySitterId(parseInt(sitterId, 10));
    const reviews = await this.petSitterRepository.findReviewsBySitterId(parseInt(sitterId, 10));

    const reservedDates = reservations.map(reservation => reservation.date.toISOString().split('T')[0]);

    const currentDate = new Date();
    const availableDates = [];

    for (let i = 1; i <= 10; i++) {
      const nextDate = new Date();
      nextDate.setDate(currentDate.getDate() + i);
      const dateString = nextDate.toISOString().split('T')[0];

      if (!reservedDates.includes(dateString)) {
        availableDates.push(dateString);
      }
    }

    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(2) : 'No ratings';

    return {
      sitter_id: petSitter.id,
      name: petSitter.name,
      experience: petSitter.experience,
      region: petSitter.region,
      profileImage: petSitter.profileImage, // 프로필 이미지 추가
      averageRating,
      availableDates,
    };
  };

  updateProfileImage = async (sitterId, imagePath) => {
    const currentImagePath = await this.petSitterRepository.getProfileImagePath(sitterId);

    if (currentImagePath) {
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const key = currentImagePath.split('/').pop();

      // 기존 이미지 삭제
      await s3.deleteObject({
        Bucket: bucketName,
        Key: key,
      }).promise();
    }

    return await this.petSitterRepository.updateProfileImage(sitterId, imagePath);
  };
}
