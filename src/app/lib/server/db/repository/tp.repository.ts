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
  findByCourseIdWithAllData(idCourse: string) {
    return db.tp.findMany({
      include: {
        responses: {
          include: {
            user: true,
            comments: {
              include: {
                user: true,
              },
            },
          },
        },
        users: true,
      },
      orderBy: {
        number: 'asc',
      },
    })
  },
})
