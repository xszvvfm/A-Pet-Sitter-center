// 필요한 모듈과 설정을 가져옵니다.
import { HttpError } from '../errors/http.error.js';
import AWS from 'aws-sdk';
import { config } from 'dotenv';
config();

// AWS S3 설정을 초기화
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// PetSitterService 클래스는 펫시터와 관련된 비즈니스 로직 처리
export class PetSitterService {
  // 생성자 함수 PetSitterRepository를 주입
  constructor(petSitterRepository) {
    this.petSitterRepository = petSitterRepository;
  }

  // 펫시터 목록 조회 메서드
  getPetSitters = async (query) => {
    // 쿼리 파라미터에서 정렬, 지역, 경력, 이름을 추출
    const { sort, region, experience, name } = query;

    // 조회 옵션 객체를 초기화
    const queryOptions = {
      where: {},
      orderBy: {},
    };

    // 지역 필터가 있는 경우 조회 옵션에 추가
    if (region) {
      queryOptions.where.region = region;
    }

    // 경력 필터가 있는 경우 조회 옵션에 추가
    if (experience) {
      queryOptions.where.experience = parseInt(experience, 10);
    }

    // 이름 필터가 있는 경우 조회 옵션에 추가
    if (name) {
      queryOptions.where.name = {
        contains: name,
      };
    }

    // 정렬 옵션이 있는 경우 조회 옵션에 추가
    if (sort) {
      const [field, order] = sort.split('_');
      queryOptions.orderBy[field] = order;
    }

    // 펫시터 목록을 조회
    const petSitters = await this.petSitterRepository.findAll(queryOptions);

    // 조회된 펫시터가 없는 경우 NotFound 에러
    if (petSitters.length === 0) {
      throw new HttpError.NotFound('검색 조건에 해당하는 펫시터가 없습니다.');
    }

    // 펫시터 목록을 필요한 형식으로 변환하여 반환.
    return petSitters.map((sitter) => ({
      sitter_id: sitter.id,
      name: sitter.name,
      experience: sitter.experience,
      region: sitter.region,
      profileImage: sitter.profileImage,
    }));
  };

  // 특정 펫시터의 상세 정보 조회 메서드.
  getPetSitterDetails = async (sitterId) => {
    // 펫시터 정보를 조회합니다.
    const petSitter = await this.petSitterRepository.findOneById(
      parseInt(sitterId, 10),
    );

    // 펫시터가 없는 경우 NotFound 에러
    if (!petSitter) {
      throw new HttpError.NotFound('펫시터를 찾을 수 없습니다.');
    }

    // 펫시터의 예약 가능날짜 조회
    const reservations =
      await this.petSitterRepository.findReservationsBySitterId(
        parseInt(sitterId, 10),
      );
    // 펫시터의 리뷰 정보를 조회
    const reviews = await this.petSitterRepository.findReviewsBySitterId(
      parseInt(sitterId, 10),
    );

    // 예약된 날짜 목록을 생성
    const reservedDates = reservations.map(
      (reservation) => reservation.date.toISOString().split('T')[0],
    );

    // 현재 날짜를 기준으로 10일 동안 예약 가능한 날짜를 생성
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

    // 리뷰의 총 평점을 계산하고 평균 평점 반환
    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const averageRating =
      reviews.length > 0
        ? (totalRatings / reviews.length).toFixed(2)
        : 'No ratings';

    // 펫시터의 상세 정보를 반환
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

  // 펫시터의 프로필 이미지 업데이트메서드
  updateProfileImage = async (sitterId, imagePath) => {
    // 현재 프로필 이미지 경로를 조회합니다.
    const currentImagePath =
      await this.petSitterRepository.getProfileImagePath(sitterId);

    // 기존 이미지가 있는 경우 삭제
    if (currentImagePath) {
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const key = currentImagePath.split('/').pop();

      // S3에서 기존 이미지를 삭제
      await s3
        .deleteObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();
    }

    // 새 프로필 이미지를 업데이트
    return await this.petSitterRepository.updateProfileImage(
      sitterId,
      imagePath,
    );
  };
}
