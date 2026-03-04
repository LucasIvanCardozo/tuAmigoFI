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
      orderBy: { id: 'asc' },
    })
  },
})
