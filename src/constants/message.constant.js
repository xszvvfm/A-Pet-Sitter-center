import { authConstant } from "./auth.constant.js";

export const MESSAGES = {
  RESERVATIONS: {
    COMMON: {
      // SITTER_ID: {
      //   REQUIRED: 'sitterId를 입력해 주세요.',
      // },
      // DATE: {
      //   REQUIRED: '날짜를 입력해 주세요.',
      // },
      // SERVICE: {
      //   REQUIRED: '서비스를 입력해 주세요.',
      // },
      NOT_FOUND: '예약이 존재하지 않습니다.',
    },
    CREATE: {
      SUCCEED: '예약 생성에 성공했습니다.',
    },
    READ_LIST: {
      SUCCEED: '예약 조회에 성공했습니다.',
    },
    DELETE: {
      SUCCEED: '예약 삭제에 성공했습니다.',
    },
  },
  AUTH: {
    COMMON:{
      EMAIL: {
      REQUIRED: '이메일을 입력해주세요',
      INVALID_FORMAT: '이메일 형식이 올바르지 않습니다.',
      DUPLICATED: '이미 가입 된 사용자입니다.',
    },
    PASSWORD:{
      REQUIRED: '비밀번호를 입력해 주세요',
      MIN_LENGTH: `비밀번호는 ${authConstant.MIN_PASSWORD_LENGTH}자리 이상이어야 합니다.`
    },
    PASSWORD_CONFIRM: {
      REQUIRED: '비밀번호 확인을 입력해 주세요',
      NOT_MACHTED_PASSWORD: '입력 한 두 비밀번호 일치하지 않습니다.',
    },
    USER_NAME: {
      REQUIRED: '이름을 입력해 주세요.',
    },
    UNAUTHORIZED: '인증 정보가 유효하지 않습니다.',
    FORBIDDEN: '접근 권한이 없습니다.',
    JWT: {
      NO_TOKEN: '인증 정보가 없습니다',
      NOT_SUPPORTED_TYPE: '지원하지 않는 인증 방식입니다.',
      EXPIRED: '인증 정보가 만료되었습니다.',
      NO_USER: '인증 정보와 일치하는 사용자가 없습니다.',
      INVALID: '인증 정보가 유효하지 않습니다.',
      DISCARDED_TOKEN: '폐기된 인증 정보입니다.',
    },
  },
  SIGN_UP: {
    SUCCEED: '회원가입에 성공했습니다.',
  },
  SIGN_IN: {
    NOT_USER: '가입되지 않은 이메일입니다.',
    SUCCEED: '로그인에 성공했습니다.',
  },
  SIGN_OUT: {
    SUCCEED: '로그아웃에 성공했습니다.',
  },
  TOKEN : {
    SUCCEED: '토큰 재발급에 성공했습니다.'
  },
},
};
