import { CourseSearchParams } from '@/app/(pages)/materias/page'
import { courseRepository } from '../db/repository/course.repository'
import db from '../db/db'
import { cacheLife, cacheTag } from 'next/cache'

export const courseUseCases = {
  async findByPage({ idDegree, page: pageAux, search, idYear }: CourseSearchParams) {
    'use cache: remote'
    cacheLife('weeks')
    cacheTag('courses')
    const page = pageAux ? Number(pageAux) : 1
    return courseRepository(db).findByPage({ idDegree, page, search, idYear })
  },
  async getById(id: string) {
    'use cache: remote'
    cacheLife('weeks')
    cacheTag('courses')
    return courseRepository(db).getById(id)
  },
  async getAmountPages({ search, idYear, idDegree }: CourseSearchParams) {
    'use cache: remote'
    cacheLife('weeks')
    cacheTag('courses')
    return Math.ceil((await courseRepository(db).getAmount({ search, idYear, idDegree })) / 5)
  },
  async findEnablesById({ idCourse, idDegree }: { idCourse: string; idDegree?: string }) {
    'use cache: remote'
    cacheLife('weeks')
    cacheTag('courses')
    return courseRepository(db).findEnablesById({ idCourse, idDegree })
  },
  async findCorrelativesById({ idCourse, idDegree }: { idCourse: string; idDegree?: string }) {
    'use cache: remote'
    cacheLife('weeks')
    cacheTag('courses')
    return courseRepository(db).findCorrelativesById({ idCourse, idDegree })
  },
  async findAll() {
    'use cache: remote'
    cacheLife('weeks')
    cacheTag('courses')
    return courseRepository(db).findAll()
  },
}
