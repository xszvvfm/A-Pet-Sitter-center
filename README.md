# 💗 저희는 A+이조! 의 Node.js 백오피스 프로젝트

## 🐶 A+ 펫 시터 센터

- [배포 웹 사이트 링크](추가 예정)
- [API 명세서 링크](https://www.notion.so/teamsparta/013ef3c01a964ae4b46aec521b116175?v=e380d7488baf4abcb07d5f45a362fe5d)
- [ERD 링크](https://drawsql.app/teams/kimmin889/diagrams/pet)
- [시연 영상 링크](추가 예정)

### 📝 프로젝트 소개

- Express.js, MySQL 을 활용해 펫 시터 매칭 서비스 제작
  - 회원가입 및 로그인, 펫 시스템 이용 후 게시글, 펫시터 예약 및 리뷰, 펫시터 정보 조회

### 📌 주요 기능

<details>
  <summary>1. 인증</summary>
  <div markdown="1">
    <ul>
      <li>회원가입 : 사용자는 이메일과 패스워드, 사용자 이름을 입력하여 회원가입 할 수 있습니다.</li>
      <li> 로그인 : 회원가입에 성공한 사용자는 이메일과 패스워드를 통하여 로그인 할 수 있습니다.</li>
      <li>로그아웃 : 로그인한 사용자의 리프레쉬 토큰이 삭제됩니다.</li>
      <li>토큰 재발급 : 만료된 액세스 토큰을 리프레쉬 토큰을 사용하여 재발급합니다.</li>
    </ul>
  </div>
</details>

<details>
  <summary>2. 내 정보 관리</summary>
  <div markdown="2">
    <ul>
      <li>내 정보 조회 : 로그인한 사용자는 본인의 정보를 조회할 수 있습니다.</li>
      <li>내 정보 수정 : 로그인한 사용자는 본인의 이름을 수정할 수 있습니다.</li>
    </ul>
  </div>
</details>

<details>
  <summary>3. 예약 CRUD</summary>
  <div markdown="3">
    <ul>
      <li>예약 생성 : 로그인한 사용자는 예약을 생성할 수 있습니다.</li>
      <li>예약 목록 조회 : 로그인한 사용자는 본인의 전체 예약 목록을 조회할 수 있습니다.</li>
      <li>예약 상세 조회 : 로그인한 사용자는 본인의 상세 예약 목록을 조회할 수 있습니다.</li>
      <li>예약 수정 : 로그인한 사용자는 본인의 예약을 수정할 수 있습니다.</li>
      <li>예약 삭제 : 로그인한 사용자는 본인의 예약을 삭제할 수 있습니다.</li>
    </ul>
  </div>
</details>

<details>
  <summary>4. 리뷰 CRUD</summary>
  <div markdown="4">
    <ul>
      <li>리뷰 작성 : 로그인한 사용자는 리뷰를 작성할 수 있습니다.</li>
      <li>본인의 리뷰 조회 : 로그인한 사용자는 본인이 작성한 리뷰를 조회할 수 있습니다.</li>
      <li>펫 시터의 리뷰 전체 조회 : 펫 시터는 펫 시터 본인에게 작성된 리뷰 전체 목록을 조회할 수 있습니다.</li>
      <li>리뷰 수정 :로그인한 사용자는 본인이 작성한 리뷰를 수정할 수 있습니다.</li>
      <li>리뷰 삭제 : 로그인한 사용자는 본인이 작성한 리뷰를 삭제할 수 있습니다.</li>
    </ul>
  </div>
</details>

<details>
  <summary>5. 좋아요 기능</summary>
  <div markdown="5">
    <ul>
      <li>리뷰 좋아요 : 로그인한 사용자는 리뷰에 '좋아요'를 표시할 수 있습니다.</li>
      <li>리뷰 좋아요 해제 : 로그인한 사용자는 리뷰에 '좋아요'를 해제할 수 있습니다.</li>
    </ul>
  </div>
</details>

<details>
  <summary>6. 펫 시터 조회 기능</summary>
  <div markdown="6">
    <ul>
      <li>펫 시터 목록 조회 : 모든 사용자는 펫 시터의 목록을 조회할 수 있습니다.</li>
      <li>펫 시터 상세 조회 : 모든 사용자는 펫 시터의 상세 정보를 조회할 수 있습니다.</li>
    </ul>
  </div>
</details>

<details>
  <summary>7. 펫 시터 이미지 업로드 기능</summary>
  <div markdown="7">
    <ul>
      <li>이미지 업로드 : 펫 시터는 본인의 프로필에 이미지를 업로드할 수 있습니다.</li>
    </ul>
  </div>
</details>

### 프로젝트 설치 및 실행 방법 (with yarn)

#### 1. 프로젝트 clone

```
git clone https://github.com/xszvvfm/A-Pet-Sitter-center.git
```

#### 2. 필요한 패키지 설치

```sh
yarn
```

#### 3. 환경 변수 설정

`.env.example` 파일의 이름을 `.env`로 변경 후 환경 변수 설정

#### 4. DB 테이블 생성

```sh
yarn prisma db push
```

#### 5. 펫시터 DB seeding 생성

```sh
yarn seed
```

#### 6. 서버 실행

- 배포용

```sh
yarn start
```

- 개발용

```sh
yarn dev
```

## 📜 프로젝트 기획 및 설계

### Minutes of meeting

- [팀 프로젝트 S.A.](https://teamsparta.notion.site/A-6d6e10a352de476297d8fc4bf5822135)
- [팀 프로젝트 회의록](https://teamsparta.notion.site/5fdb8770bced4b7eba645f251e1a6d5f?v=84a22462053945a8a0e040e59248f1c1)

### [Code Convention](https://teamsparta.notion.site/Code-Convention-469306858b9742e09cad38849c9c6123)

### Github Rules

| 작업 타입   | 작업 내용                                |
| ----------- | ---------------------------------------- |
| ✨ Update   | 해당 파일에 새로운 기능이 생김           |
| 🎉 Feat     | 없던 파일을 생성함, 초기 세팅, 기능 구현 |
| 🐛 Bugfix   | 버그 수정                                |
| ♻️ Refactor | 코드 리팩토링                            |
| 🩹 Fix      | 코드 수정                                |

## 📌 기술 스택

### Environment

![Git](https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Github](https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Vscode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)

### Development

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![AMAZON EC2](https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=Amazon%20EC2&logoColor=white)
![AMAZON RDS](https://img.shields.io/badge/amazonrds-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white)
![AMAZON S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=Amazon%20S3&logoColor=white)

### Communication

![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white)

## 👨‍👨‍👦‍👦 프로젝트 제작 인원

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/xszvvfm"><img src="https://avatars.githubusercontent.com/u/161733851?v=4" width="100px;" alt="방채은"/><br /><sub><b> 팀장 : 방채은 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/gus11als"><img src="https://avatars.githubusercontent.com/u/102670376?v=4" width="100px;" alt="김현민"/><br /><sub><b> 팀원 : 김현민 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/jiyoon-na"><img src="https://avatars.githubusercontent.com/u/164995957?v=4" width="100px;" alt="나지윤"/><br /><sub><b> 팀원 : 나지윤 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/leegilhyeon"><img src="https://avatars.githubusercontent.com/u/164996803?v=4" width="100px;" alt="이길현"/><br /><sub><b> 팀원 : 이길현 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/hyodong2"><img src="https://avatars.githubusercontent.com/u/167263781?v=4" width="100px;" alt="이동효"/><br /><sub><b> 팀원 : 이동효 </b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

### 👩‍👩‍👦역할 분배

<details>
  <summary>공통사항</summary>
  <div markdown="1">
    <ul>
      <li>API 명세서 작성</li>
      <li>ERD 작성</li>
      <li>스키마 모델 작성</li>
      <li>발표 자료 및 대본 작성</li>
    </ul>
  </div>
</details>

<details>
  <summary>방채은</summary>
  <div markdown="2">
    <ul>
      <li>예약 생성, 목록 조회 및 삭제</li>
      <li>README.md</li>
      <li>배포</li>
    </ul>
  </div>
</details>

<details>
  <summary>김현민</summary>
  <div markdown="3">
    <ul>
      <li>리뷰 CRUD</li>
      <li>리뷰 좋아요 기능</li>
      <li>펫 시터 목록 조회 및 상세 조회</li>
      <li>multer를 이용한 펫 시터 프로필 이미지 업로드</li>
      <li>AWS S3 구성 및 설정</li>
    </ul>
  </div>
</details>

<details>
  <summary>나지윤</summary>
  <div markdown="4">
    <ul>
      <li>예약 상세 조회 및 수정</li>
      <li>발표 영상 편집</li>
    </ul>
  </div>
</details>

<details>
  <summary>이길현</summary>
  <div markdown="5">
    <ul>
      <li>인증 (회원가입, 로그인, 로그아웃)</li>
      <li>Access Token, Refresh Token, 인가 미들웨어</li>
      <li>내 정보 조회 및 수정</li>
      <li>README.md</li>
    </ul>
  </div>
</details>

<details>
  <summary>이동효</summary>
  <div markdown="6">
    <ul>
      <li>예약 생성, 조회</li>
      <li>발표</li>
    </ul>
  </div>
</details>
