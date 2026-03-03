import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const courseRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  getById(id: string) {
    return db.course.findFirstOrThrow({ where: { id } })
  },
  getAmount({ search, idYear, idDegree }: { search?: string; idYear?: string; idDegree?: string }) {
    return db.course.count({
      where: {
        nameNormalized: {
          contains: search,
          mode: 'insensitive',
        },
        ...(idYear
          ? {
              courses_years: {
                some: { idYear },
              },
            }
          : {}),
        ...(idDegree
          ? {
              courses_degrees: {
                some: { idDegree },
              },
            }
          : {}),
      },
    })
  },
  findAll() {
    return db.course.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    })
  },
  findByPage({ search, idYear, idDegree, page, max = 5 }: { search?: string; idYear?: string; idDegree?: string; page?: number; max?: number }) {
    return db.course.findMany({
      where: {
        nameNormalized: {
          contains: search,
          mode: 'insensitive',
        },
        ...(idYear ? { courses_years: { some: { idYear } } } : {}),
        ...(idDegree ? { courses_degrees: { some: { idDegree } } } : {}),
      },
      orderBy: { name: 'asc' },
      ...(page
        ? {
            take: max,
            skip: (page - 1) * max,
          }
        : { take: max, skip: 0 }),
    })
  },
  findCorrelativesById({ idCourse, idDegree }: { idCourse: string; idDegree?: string }) {
    return db.course.findMany({
      where: {
        correlatives_correlatives_id_correlativeTocourses: { some: { idCourse } },
        ...(idDegree ? { courses_degrees: { some: { idDegree } } } : {}),
      },
      select: {
        id: true,
        name: true,
      },
    })
  },
  findEnablesById({ idCourse, idDegree }: { idCourse: string; idDegree?: string }) {
    return db.course.findMany({
      where: {
        correlatives_correlatives_idTocourses: {
          some: { idCourse },
        },
        ...(idDegree ? { courses_degrees: { some: { idDegree } } } : {}),
      },
      select: {
        id: true,
        name: true,
      },
    })
  },
})
