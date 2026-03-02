import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const tpRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  findByCourseId(idCourse: string) {
    return db.tp.findMany({
      where: { idCourse },
      orderBy: {
        number: 'asc',
      },
    })
  },
  
})
