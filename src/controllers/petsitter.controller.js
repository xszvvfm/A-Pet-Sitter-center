// PetSitterController 클래스는 펫시터와 관련된 API 요청을 처리
export class PetSitterController {
  // 생성자 함수에서는 petSitterService를 주입
  constructor(petSitterService) {
    this.petSitterService = petSitterService;
  }

  // 펫시터 목록을 조회 메서드
  getPetSitters = async (req, res, next) => {
    try {
      // petSitterService를 사용하여 펫시터 목록을 조회합니다. req.query를 통해 쿼리 파라미터를 전달
      const petSitters = await this.petSitterService.getPetSitters(req.query);

      // 성공적으로 조회된 경우 200 상태 코드와 함께 데이터를 반환
      res.status(200).json({
        status: 200,
        message: '펫시터들 목록조회에 성공했습니다.',
        data: petSitters,
      });
    } catch (error) {
      // 에러가 발생한 경우 next 함수를 호출하여 에러 미들웨어로 전달
      next(error);
    }
  };

  // 특정 펫시터의 상세 정보 조회 메서드
  getPetSitterDetails = async (req, res, next) => {
    // 요청 파라미터에서 sitterId를 추출합니다.
    const { sitterId } = req.params;

    try {
      // petSitterService를 사용하여 특정 펫시터의 상세 정보를 조회합니다. sitterId는 정수로 변환하여 전달
      const petSitterDetails = await this.petSitterService.getPetSitterDetails(
        parseInt(sitterId, 10),
      );

      // 성공적으로 조회된 경우 200 상태 코드와 함께 데이터를 반환
      res.status(200).json({
        status: 200,
        message: '예약 가능한 날짜 조회에 성공했습니다.',
        data: petSitterDetails,
      });
    } catch (error) {
      // 에러가 발생한 경우 next 함수를 호출하여 에러 미들웨어로 전달
      next(error);
    }
  };

  // 펫시터의 프로필 이미지 업로드 메서드
  uploadProfileImage = async (req, res, next) => {
    // 요청 파라미터에서 sitterId를 추출합니다.
    const { sitterId } = req.params;

    try {
      // 업로드된 파일의 위치(S3 URL)를 가져옵니다.
      const imagePath = req.file.location; // S3 URL

      // petSitterService를 사용하여 프로필 이미지를 업데이트 sitterId는 정수로 변환하여 전달
      const result = await this.petSitterService.updateProfileImage(
        parseInt(sitterId, 10),
        imagePath,
      );

      // 성공적으로 업로드된 경우 200 상태 코드와 함께 데이터를 반환
      res.status(200).json({
        status: 200,
        message: '프로필 이미지 업로드에 성공했습니다.',
        data: result,
      });
    } catch (error) {
      // 에러가 발생한 경우 next 함수를 호출하여 에러 미들웨어로 전달
      next(error);
    }
  };
}
