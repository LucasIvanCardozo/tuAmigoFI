import db from '../db/db'
import { midtermRepository } from '../db/repository/midterm.repository'

export const midtermUseCases = {
  findByCourseId(idCourse: string) {
    return midtermRepository(db).findByCourseId(idCourse)
  },
}
