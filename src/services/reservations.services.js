import { HttpError } from '../errors/httperror.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { prisma } from '@prisma/client';
export class reservationService {
  update = async ({ sitter_id, date }) => {
    //있는 예약인지 확인하기 : service
    const existReservation = await prisma.reservation.findUnique({
      where: {
        id: sitter_id,
        date: date,
      },

      //service,
    });
    if (!existReservation) {
      //아래에 넣을 내용 HttpError.
      throw new HttpError.HTTP_STATUS.CONFLICT(
        MESSAGES.RESERVATION.READ.IS_NOT_RESERVATION,
      );
    }

    //서비스타입
    const validServiceTypes = Object.values(service);

    if (!validServiceTypes.includes(service)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: MESSAGES.RESERVATION.INVALID_SERVICE_TYPE,
      });
      return;
    }
    const patchResevation = await prisma.reservation.update({
      where: {
        id: sitter_id,
        date: date,
      },
      patchResevation: {
        ...(sitter_id && { sitter_id }),
        ...(date && { date }),
      },
    });
  };
}
