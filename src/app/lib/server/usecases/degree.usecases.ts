import { cacheLife, cacheTag } from 'next/cache'
import db from '../db/db'
import { degreeRepository } from '../db/repository/degree.repository'

export const degreeUseCases = {
  async findAll() {
    'use cache'
    cacheLife('weeks')
    cacheTag('degrees')
    return degreeRepository(db).findAll()
  },
  async findAllWithPlans() {
    'use cache'
    cacheLife('weeks')
    cacheTag('degrees')
    return degreeRepository(db).findAllWithPlans()
  },
  async findByCourseId(idCourse: string) {
    'use cache'
    cacheLife('weeks')
    cacheTag('degrees')
    return degreeRepository(db).findByCourseId(idCourse)
  },
}
