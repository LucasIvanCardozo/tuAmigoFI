import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const yearRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  findAll() {
    return db.year.findMany()
  },
})
