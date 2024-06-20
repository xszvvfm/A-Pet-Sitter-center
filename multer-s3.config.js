// 필요한 모듈을 가져옵니다.
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { config } from 'dotenv';

// 환경변수 설정을 로드
config();

// AWS S3 설정을 초기화
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS 액세스 키 ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // AWS 비밀 액세스 키
  region: process.env.AWS_REGION, // AWS 리전
});

// Multer 설정을 구성
const upload = multer({
  // 파일 저장소를 S3로 설정
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME, // S3 버킷 이름
    acl: 'public-read', // 파일 접근 권한 설정
    contentDisposition: 'inline', // 파일 콘텐츠 디스포지션 설정(다운로드 방식에서 미리보기 방식으로 변경)
    contentType: multerS3.AUTO_CONTENT_TYPE, // 자동으로 Content-Type 설정
    key: (req, file, cb) => {
      // 파일 이름을 현재 시간 + 원래 파일 확장자로 설정
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
});

// upload 객체를 기본으로 내보내기
export default upload;
