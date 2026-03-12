import { PrismaClient } from './prisma/prismaClient/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  var prismaGlobal: PrismaClient | undefined
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const db = globalThis.prismaGlobal ?? new PrismaClient({ adapter, log: ['query', 'info', 'warn', 'error'] })

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db

export default db
