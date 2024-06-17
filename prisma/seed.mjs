import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const petSitters = [
    { name: '김철수', experience: 5, region: '부산' },
    { name: '김영미', experience: 3, region: '경기' },
    { name: '김동수', experience: 3, region: '서울' },
    { name: '김민수', experience: 1, region: '광주' },
    { name: '김수민', experience: 2, region: '평택' },
    { name: '김수철', experience: 10, region: '제주' },
  ];

  for (const petSitter of petSitters) {
    await prisma.petSitter.create({
      data: petSitter,
    });
  }

  console.log('펫시터 데이터 넣기 성공');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
