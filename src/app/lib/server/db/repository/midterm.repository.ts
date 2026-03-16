import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const midtermRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  findByCourseId(idCourse: string) {
    return db.midterm.findMany({
      where: { idCourse },
      orderBy: { id: 'asc' },
    })
  },
  findByCourseIdWithAllData(idCourse: string) {
    return db.midterm.findMany({
      where: { idCourse },
      include: {
        responses: {
          include: {
            user: true,
            comments: {
              include: {
                user: true,
              },
              orderBy: {
                updatedAt: 'desc',
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
        users: true,
      },
      orderBy: { id: 'asc' },
    })
  },
})
