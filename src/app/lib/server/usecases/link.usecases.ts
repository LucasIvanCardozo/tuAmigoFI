import db from '../db/db'
import { linkRepository } from '../db/repository/link.repository'

export const linkUseCases = {
  findByCourseId: (idCourse: string) => {
    return linkRepository(db).findByCourseId(idCourse)
  },
}
