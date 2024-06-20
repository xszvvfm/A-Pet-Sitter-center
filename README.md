# A+ Pet Sitter center

# 💗 저희는 A+이조의 Node.js 뉴스피드 프로젝트

![썸네일](./imgs/thumbnail.png)

## 📝프로젝트 소개

- 프로젝트 이름 : A+ 펫 시터 센터
- 내용 : 펫 케어 관련 서비스를 제공하는 펫 시터 예약 시스템
- 구분 : 팀 프로젝트
- GitHub : https://github.com/xszvvfm/A-Pet-Sitter-center
- 시연 영상 :
- 배포 :

<br>

## 👩‍👩‍👦역할 분배

- **공통사항**
  - 스키마 모델 작성
  - API 명세서 작성
  - ERD 작성
  - 발표자료,대본 작성
- **방채은**
  - 예약 생성,조회
  - 예약 삭제
- **나지윤**
  - 예약 상세조회, 예약 수정
- **이길현**
  - 회원가입/로그인/로그아웃
  - Access Token, Refresh Token, 인가 미들웨어
  - 내 정보 조회, 수정
- **이동효**
  - 예약 생성, 조회
- **김현민**
  - 리뷰 CRUD
  - 리뷰 좋아요/좋아요 취소
  - AWS S3 구성 및 설정, 배포
  - multer를 이용한 이미지 업로더
  - 펫시터 목록조회, 상세조회

## 📌기술 스택

### Environment

<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
  <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
  <img src="https://img.shields.io/badge/Visual Studio-5C2D91?style=flat-square&logo=visual-studio&logoColor=white">

### Development

<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">

![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)

### Communication

![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white)

## 4. API 명세서 및 ERD, 와이어 프레임

- API 명세서 : https://www.notion.so/teamsparta/013ef3c01a964ae4b46aec521b116175?v=e380d7488baf4abcb07d5f45a362fe5d
- ERD : ![alt text](image.png)
- 와이어프레임 : ![alt text](image-2.png)

## 5. 주요 기능 및 설명

## 6. 어려웠던 점

<br>

# 실행 방법 (with yarn)

- 필요한 패키지 설치

```sh
yarn
```

- DB 테이블 생성

```sh
yarn prisma db push
```

- 서버 실행 (배포용)

```sh
yarn start
```

- 서버 실행 (개발용)

```sh
yarn dev
```

- prisma 초기화후 업데이트

```sh
npx prisma db push --force-reset
```
