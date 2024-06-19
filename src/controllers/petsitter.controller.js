export class PetSitterController {
  constructor(petSitterService) {
    this.petSitterService = petSitterService;
  }

  getPetSitters = async (req, res, next) => {
    try {
      const petSitters = await this.petSitterService.getPetSitters(req.query);
      res.status(200).json({
        status: 200,
        message: '펫시터들 목록조회에 성공했습니다.',
        data: petSitters,
      });
    } catch (error) {
      next(error);
    }
  };

  getPetSitterDetails = async (req, res, next) => {
    const { sitterId } = req.params;

    try {
      const petSitterDetails = await this.petSitterService.getPetSitterDetails(parseInt(sitterId, 10));
      res.status(200).json({
        status: 200,
        message: '예약 가능한 날짜 조회에 성공했습니다.',
        data: petSitterDetails,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadProfileImage = async (req, res, next) => {
    const { sitterId } = req.params;

    try {
      const imagePath = req.file.location; // S3 URL
      const result = await this.petSitterService.updateProfileImage(parseInt(sitterId, 10), imagePath);
      res.status(200).json({
        status: 200,
        message: '프로필 이미지 업로드에 성공했습니다.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
