import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const responseRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  findFromTp(idTp: string) {
    return db.response.findMany({
      where: { idTp },
      orderBy: { number: 'asc' },
    })
  },
  findFromMidterm(idMidterm: string) {
    return db.response.findMany({
      where: { idMidterm },
      orderBy: { number: 'asc' },
    })
  },
})
