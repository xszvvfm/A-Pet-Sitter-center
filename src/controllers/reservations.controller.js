import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/messages.const.js';

const reservationService = new reservationService();

export class reservationsController {
  update = async (res, req, next) => {
    //예약수정 : 시터아이디, 날짜, 서비스타입 : 바디로 받아오기

    try {
      //예약한 아이디가져오기
      // const user = req.user;
      // const userId = user.id;
      //reserveId 가져오기
      const { id } = req.params;
      //수정할 정보
      const { sitter_id, date, service } = req.body;
      //------//
      //있는 예약인지 확인하기 : service

      //-----//가져올 아이디 등 어떻게 가져올지 다시 보기
      const data = await reservationService.update({
        id,
        sitter_id,
        date,
        service,
      });

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESERVATION.UPDATE.SUCCED,
        data,
      });
    } catch (error) {
      // next(error);
    }
  };
}