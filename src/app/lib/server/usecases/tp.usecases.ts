import db from '../db/db'
import { tpRepository } from '../db/repository/tp.repository'

export const tpUseCases = {
  findByCourseId: (idCourse: string) => {
    return tpRepository(db).findByCourseId(idCourse)
  },
  findByCourseIdWithAllData: (idCourse: string) => {
    return tpRepository(db).findByCourseIdWithAllData(idCourse)
  },
}
