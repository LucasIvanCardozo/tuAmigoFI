import 'dotenv/config'
import { PrismaClient } from './prismaClient/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { degreeSeed } from './seeds/degree.seed'
import { courseSeed } from './seeds/course.seed'
import { yearSeed } from './seeds/year.seed'
import { planSeed } from './seeds/plan.seed'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

async function main() {
  await Promise.all([degreeSeed(db), courseSeed(db), yearSeed(db), planSeed(db)])
}

main()
  .then(async () => {
    await db.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    await pool.end()
    process.exit(1)
  })
