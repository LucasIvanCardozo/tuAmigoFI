import db from '../db/db'
import { degreeRepository } from '../db/repository/degree.repository'

export const degreeUseCases = {
  findAll() {
    return degreeRepository(db).findAll()
  },
  findAllWithPlans() {
    return degreeRepository(db).findAllWithPlans()
  },
  findByCourseId(idCourse: string) {
    return degreeRepository(db).findByCourseId(idCourse)
  },
}
