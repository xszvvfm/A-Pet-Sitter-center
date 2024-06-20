import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class UserController {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  //정보조회
  getUser = async (req, res, next) => {
    try {
      const { id } = req.user;
      const data = await this.usersRepository.findUser(id);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USER.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
  //정보수정
  updateUser = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { username } = req.body;
      if (!username) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ message: MESSAGES.USER.EMPTY });
      }
      const user = await this.usersRepository.readOneById(id);

      if (username === user.username) {
        return res.status(400).json({ message: MESSAGES.USER.DUPLICATE });
      }

      //중복체크
      const existedName = await this.usersRepository.findName(username);
      if (existedName) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          message: MESSAGES.USER.REQUIRED,
        });
      }

      const updateData = { username };
      const updateUserInfo = await this.usersRepository.updateInfo(
        id,
        updateData,
      );
      const userInfo = {
        id: updateUserInfo.id,
        email: updateUserInfo.email,
        username: updateUserInfo.username,
        createdAt: updateUserInfo.createdAt,
        updatedAt: updateUserInfo.updatedAt,
      };
      return res
        .status(HTTP_STATUS.OK)
        .json({ message: MESSAGES.USER.PATCH_SUCCEED, data: userInfo });
    } catch (error) {
      next(error);
    }
  };
}
