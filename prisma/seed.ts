import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('', 10);

  const admin = await prisma.users.upsert({
    where: { email: '' },
    update: {},
    create: {
      email: '',
      password,
      name: '',
      role: 'ADMIN',
    },
  });
  console.log(`seed 완료`);
}

main()
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
