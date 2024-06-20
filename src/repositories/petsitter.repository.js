// PetSitterRepository 클래스는 Prisma ORM을 사용하여 펫시터와 관련된 데이터베이스 작업을 수행합니다.
export class PetSitterRepository {
  // 생성자 함수에서는 Prisma 인스턴스를 주입
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 모든 펫시터를 조회 메서드
  findAll = async (queryOptions) => {
    // Prisma를 사용하여 쿼리 옵션에 따라 펫시터 목록을 조회
    return await this.prisma.petSitter.findMany(queryOptions);
  };

  // 특정 ID를 가진 펫시터를 조회하는 메서드
  findOneById = async (id) => {
    // Prisma를 사용하여 특정 ID에 해당하는 펫시터를 조회
    return await this.prisma.petSitter.findUnique({
      where: { id }, // 조회 조건
    });
  };

  // 특정 펫시터의 예약 정보 조회 메서드
  findReservationsBySitterId = async (sitterId) => {
    // Prisma를 사용하여 특정 펫시터 ID에 해당하는 예약 목록을 조회
    return await this.prisma.reservation.findMany({
      where: { sitterId }, // 조회 조건
      select: { date: true }, // 선택적으로 날짜 정보만 반환
    });
  };

  // 특정 펫시터의 리뷰 정보 조회 메서드
  findReviewsBySitterId = async (sitterId) => {
    // Prisma를 사용하여 특정 펫시터 ID에 해당하는 리뷰 목록을 조회합니다.
    return await this.prisma.review.findMany({
      where: { sitterId }, // 조회 조건
      select: { rating: true }, // 선택적으로 평점 정보만 반환
    });
  };

  // 특정 펫시터의 프로필 이미지 경로 조회 메서드
  getProfileImagePath = async (sitterId) => {
    // Prisma를 사용하여 특정 펫시터 ID에 해당하는 프로필 이미지 경로를 조회
    const petSitter = await this.prisma.petSitter.findUnique({
      where: { id: sitterId }, // 조회 조건
      select: { profileImage: true }, // 선택적으로 프로필 이미지 정보만 반환
    });
    // 프로필 이미지 경로를 반환하거나, 펫시터가 없는 경우 null을 반환
    return petSitter ? petSitter.profileImage : null;
  };

  // 특정 펫시터의 프로필 이미지 업데이트 메서드
  updateProfileImage = async (sitterId, imagePath) => {
    // Prisma를 사용하여 특정 펫시터 ID에 해당하는 프로필 이미지를 업데이트
    return await this.prisma.petSitter.update({
      where: { id: sitterId }, // 업데이트 조건
      data: { profileImage: imagePath }, // 업데이트할 데이터
      select: { profileImage: true }, // 선택적으로 프로필 이미지 정보만 반환
    });
  };
}
