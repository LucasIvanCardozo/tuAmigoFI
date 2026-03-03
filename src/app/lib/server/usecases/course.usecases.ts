import { CourseSearchParams } from '@/app/(pages)/materias/page'
import { courseRepository } from '../db/repository/course.repository'
import db from '../db/db'

export const courseUseCases = {
  findByPage({ idDegree, page: pageAux, search, idYear }: CourseSearchParams) {
    const page = pageAux ? Number(pageAux) : 1

    return courseRepository(db).findByPage({ idDegree, page, search, idYear })
  },
  getById(id: string) {
    return courseRepository(db).getById(id)
  },
  async getAmountPages({ search, idYear, idDegree }: CourseSearchParams) {
    return Math.ceil((await courseRepository(db).getAmount({ search, idYear, idDegree })) / 5)
  },
  findEnablesById({ idCourse, idDegree }: { idCourse: string; idDegree?: string }) {
    return courseRepository(db).findEnablesById({ idCourse, idDegree })
  },
  findCorrelativesById({ idCourse, idDegree }: { idCourse: string; idDegree?: string }) {
    return courseRepository(db).findCorrelativesById({ idCourse, idDegree })
  },
  findAll() {
    return courseRepository(db).findAll()
  },
}
