import { authConstant } from './auth.constant.js';

export const MESSAGES = {
  RESERVATIONS: {
    COMMON: {
      SITTER_ID: {
        REQUIRED: 'sitterId를 입력해 주세요.',
        NUMBER_BASE: 'sitterId는 숫자여야 합니다.',
        INTEGER: 'sitterId는 정수여야 합니다.',
        INVALID: '유효하지 않은 sitterId 입니다.',
      },
      DATE: {
        REQUIRED: '날짜를 입력해 주세요.',
        DATE_BASE: '날짜는 유효한 날짜여야 합니다.',
      },
      SERVICE: {
        REQUIRED: '서비스를 입력해 주세요.',
      },
      NOT_FOUND: '예약이 존재하지 않습니다.',
    },
    CREATE: {
      IS_EXIST: '해당 날짜에 펫시터의 예약이 이미있습니다.',
      IS_NOT_EXIST: '없는 시터 정보입니다.',
      INVALID_SERVICE_TYPE:
        'PET_WALKING 이나 PET_CARE, PET_GROOMING 에서 서비스를 골라주세요',
      SUCCEED: '예약 생성에 성공했습니다.',
    },
    READ: {
      IS_NOT_RESERVATION: '없는 예약정보입니다.',
      SUCCEED: '예약 조회에 성공했습니다.',
    },
    UPDATE: {
      SUCCEED: '예약수정이 완료되었습니다.',
      IS_RESERVATION: '이미 있는 예약입니다. 다른 날을 선택해주세요.',
    },
    DELETE: {
      SUCCEED: '예약 삭제에 성공했습니다.',
    },
  },
  AUTH: {
    COMMON: {
      EMAIL: {
        REQUIRED: '이메일을 입력해주세요',
        INVALID_FORMAT: '이메일 형식이 올바르지 않습니다.',
        DUPLICATED: '이미 가입 된 사용자입니다.',
      },
      PASSWORD: {
        REQUIRED: '비밀번호를 입력해 주세요',
        MIN_LENGTH: `비밀번호는 ${authConstant.MIN_PASSWORD_LENGTH}자리 이상이어야 합니다.`,
        NOT_MACHTED: '비밀번호를 확인해주세요.',
      },
      PASSWORD_CONFIRM: {
        REQUIRED: '비밀번호 확인을 입력해 주세요',
        NOT_MACHTED_PASSWORD: '입력 한 두 비밀번호 일치하지 않습니다.',
      },
      USER_NAME: {
        REQUIRED: '이름을 입력해 주세요.',
        EMPTY: '이름은 비워둘 수 없습니다',
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
      //로그인 정보가 유효한지 : 있는 이메일인지, 비밀번호 맞는지
      IS_NOT_EMAIL: '인증정보가 유효하지 않습니다.',
      NOT_USER: '가입되지 않은 이메일입니다.',
      SUCCEED: '로그인에 성공했습니다.',
    },
    SIGN_OUT: {
      IS_NOT_EXIST: '정보가 일치하지 않습니다.',
      SUCCEED: '로그아웃에 성공했습니다.',
    },
    TOKEN: {
      SUCCEED: '토큰 재발급에 성공했습니다.',
    },
  },
  PESITTER: {
    REQUIRED: '펫시터 아이디를 입력해주세요',
    IS_NOT_NUMBER: '아이디는 숫자입니다.',
  },
  REVIEW: {
    SUCCEED: '리뷰작성에 성공하였습니다.',
    PATCH_SUCCEED: '리뷰수정에 성공하였습니다.',
    DELTE_SUCCEED: '리뷰 삭제에 성공하였습니다.',
    FAIL: '실패하였습니다.',
    //리뷰작성 성공, 수정성공, 삭제성공,
  },
  USER: {
    SUCCEED: '유저 정보 조회에 성공했습니다.',
  },
};
