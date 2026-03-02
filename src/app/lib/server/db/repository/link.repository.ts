import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const linkRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  findByCourseId(idCourse: string) {
    return db.link.findMany({
      where: { idCourse },
    })
  },
})
