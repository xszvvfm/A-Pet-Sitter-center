export const MESSAGES = {
  AUTH: {
    SIGNUP: {
      //회원가입시 이메일 유효한지 비밀번호 일치하는지, 있는지,
      COMMON: {
        EMAIL: {
          REQUIRED: '이메일을 입력해주세요.',
          INVALID_FORMAT: '이메일 형식이 올바르지 않습니다.',
        },
        PASSWORD: {
          REQUIRED: '비밀번호를 입력해주세요.',
          MIN_LENGTH: '비밀번호는 6자리 이상이어야 합니다.',
        },
        NAME: {
          REQUIRED: '이름을 입력해주세요.',
          EMPTY: '이름은 비워둘 수 없습니다',
        },
      },
      SUCCEED: '회원가입에 성공했습니다.',
    },
    SIGNIN: {
      //로그인 정보가 유효한지 : 있는 이메일인지, 비밀번호 맞는지
      IS_NOT_EMAIL: '인증정보가 유효하지 않습니다.',
      SUCCEED: '로그인에 성공했습니다.',
    },
    SIGN_OUT: {
      IS_NOT_EXIST: '정보가 일치하지 않습니다.',
      SUCCEED: '로그아웃에 성공했습니다.',
    },
    TOKEN: {
      SUCCEED: '토큰발급에 성공했습니다.',
    },
  },

  PESITTER: {
    REQUIRED: '펫시터 아이디를 입력해주세요',
    IS_NOT_NUMBER: '아이디는 숫자입니다.',
  },
  RESERVATION: {
    CREATE: {
      IS_EXIST: '해당 날짜에 펫시터의 예약이 이미있습니다.',
      IS_NOT_EXIST: '없는 시터 정보입니다.',
      INVALID_SERVICE_TYPE:
        'PET_WALKING 이나 PET_CARE, PET_GROOMING 에서 서비스를 골라주세요',
      SUCCEED: '예약이 완료되었습니다.',
    },
    READ: {
      IS_NOT_RESERVATION: '없는 예약정보입니다.',
      SUCCEED: '예약조회에 성공했습니다.',
    },
    UPDATE: {
      SUCCEED: '예약수정이 완료되었습니다.',
    },
    COMMON: {
      NOT_FOUND: '예약이 존재하지 않습니다.',
    },
    DELETE: {
      SUCCEED: '예약 삭제에 성공했습니다.',
    },
  },
  REVIEW: {
    SUCCEED: '리뷰작성에 성공하였습니다.',
    PATCH_SUCCEED: '리뷰수정에 성공하였습니다.',
    DELTE_SUCCEED: '리뷰 삭제에 성공하였습니다.',
    FAIL: '실패하였습니다.',
    //리뷰작성 성공, 수정성공, 삭제성공,
  },
  // REFRESHTOKEN: {
  //     //발급성공
  //   },
};
