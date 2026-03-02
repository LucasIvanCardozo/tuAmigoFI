import 'dotenv/config'
import type { PrismaConfig } from 'prisma'
import { env } from 'prisma/config'

export default {
  schema: 'src/app/lib/server/db/prisma/schema.prisma',
  migrations: {
    path: 'src/app/lib/server/db/prisma/',
    seed: 'tsx src/app/lib/server/db/prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
    
  },
} satisfies PrismaConfig
