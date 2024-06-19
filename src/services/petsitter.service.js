import { HttpError } from '../errors/http.error.js';

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
    }));
  };

  getPetSitterDetails = async (sitterId) => {
    const petSitter = await this.petSitterRepository.findOneById(parseInt(sitterId, 10));

    if (!petSitter) {
      throw new HttpError.NotFound('펫시터를 찾을 수 없습니다.');
    }

    const reservations = await this.petSitterRepository.findReservationsBySitterId(parseInt(sitterId, 10));
    const reviews = await this.petSitterRepository.findReviewsBySitterId(parseInt(sitterId, 10)); // 리뷰 조회 추가

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

    // 평균 평점 계산
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(2) : 'No ratings';

    return {
      sitter_id: petSitter.id,
      name: petSitter.name,
      experience: petSitter.experience,
      region: petSitter.region,
      averageRating, // 평균 평점 추가
      availableDates,
    };
  };
}
