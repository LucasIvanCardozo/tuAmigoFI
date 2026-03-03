import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const degreeRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  findAll() {
    return db.degree.findMany()
  },
  findAllWithPlans() {
    return db.degree.findMany({
      include: {
        degrees_plans: {
          select: {
            plans: true,
          },
        },
      },
    })
  },
  findByCourseId(idCourse: string) {
    return db.degree.findMany({
      where: { courses_degrees: { some: { idCourse } } },
      orderBy: { id: 'asc' },
    })
  },
})

export type DegreesWithPlansType = Prisma.DegreeGetPayload<{ include: { degrees_plans: { select: { plans: true } } } }>
