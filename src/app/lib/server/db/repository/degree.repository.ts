import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const degreeRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  findAll() {
    return db.degree.findMany()
  },
  findByCourseId(idCourse: string) {
    return db.degree.findMany({
      where: { courses_degrees: { some: { idCourse } } },
      orderBy: { id: 'asc' },
    })
  },
})
