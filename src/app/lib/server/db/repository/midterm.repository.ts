import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const midtermRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  findByCourseId(idCourse: string) {
    return db.midterm.findMany({
      where: { idCourse },
      orderBy: { id: 'asc' },
    })
  },
})
