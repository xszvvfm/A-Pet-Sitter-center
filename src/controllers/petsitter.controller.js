// src/controllers/petsitter.controller.js
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
        const petSitterDetails = await this.petSitterService.getPetSitterDetails(sitterId);
        res.status(200).json({
          status: 200,
          message: '예약 가능한 날짜 조회에 성공했습니다.',
          data: petSitterDetails,
        });
      } catch (error) {
        next(error);
      }
    };
  }