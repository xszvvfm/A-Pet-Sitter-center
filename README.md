# A+ Pet Sitter center

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
