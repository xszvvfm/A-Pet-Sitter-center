import { prisma } from '@prisma/client';
import { HttpError } from '../errors/httperror.js';
import { MESSAGES } from '../constants/messages.const.js';

export class reservationsRepository {
  update = async (id, sitter_id, date, service) => {
    const existReservation = await prisma.reservation.findUnique({
      where: {
        id,
        sitter_id,
        date,
        service,
      },

      //service,
    });
    if (!existReservation) {
      //아래에 넣을 내용 HttpError.
      throw new HttpError.HTTP_STATUS.CONFLICT(
        MESSAGES.RESERVATION.READ.IS_NOT_RESERVATION,
      );
    }
    const patchResevation = await prisma.reservation.update({
      where: {
        id,
        sitter_id,
        date,
        service,
      },
      patchResevation: {
        ...(sitter_id && { sitter_id }),
        ...(date && { date }),
        ...(service && { service }),
      },
    });
    return patchResevation;
  };
}
