import { PrismaClient } from '@prisma/client';

// PrismaClient 인스턴스를 생성
const prisma = new PrismaClient();

async function main() {
  // 삽입할 펫시터 데이터 배열을 정의
  const petSitters = [
    { name: '김철수', experience: 5, region: '부산' },
    { name: '김영미', experience: 3, region: '경기' },
    { name: '김동수', experience: 3, region: '서울' },
    { name: '김민수', experience: 1, region: '광주' },
    { name: '김수민', experience: 2, region: '평택' },
    { name: '김수철', experience: 10, region: '제주' },
  ];

  // 각 펫시터 데이터를 데이터베이스에 삽입
  for (const petSitter of petSitters) {
    await prisma.petSitter.create({
      data: petSitter, // 데이터베이스에 삽입할 펫시터 데이터를 전달
    });
  }

  console.log('펫시터 데이터 넣기 성공'); // 데이터 삽입이 완료되면 메시지를 출력
}

// main 함수를 실행
main()
  .catch((e) => {
    console.error(e); // 오류가 발생하면 콘솔에 오류를 출력
    process.exit(1); // 프로세스를 종료
  })
  .finally(async () => {
    await prisma.$disconnect(); // PrismaClient 연결을 종료
  });
