import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from './prismaClient/client';
import { correlativeSeed } from './seeds/correlative.seed';
import { courseSeed } from './seeds/course.seed';
import { degreeSeed } from './seeds/degree.seed';
import { planSeed } from './seeds/plan.seed';
import { yearSeed } from './seeds/year.seed';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  await Promise.all([courseSeed(db)]);
  await Promise.all([yearSeed(db), degreeSeed(db), correlativeSeed(db)]);
  await planSeed(db);
}

main()
  .then(async () => {
    await db.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    await pool.end();
    process.exit(1);
  });
