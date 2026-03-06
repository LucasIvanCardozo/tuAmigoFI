import { makeModules } from '@/app/utils/makeModules'
import db from '../db/db'
import { midtermRepository } from '../db/repository/midterm.repository'

export const midtermUseCases = {
  findByCourseId(idCourse: string) {
    return midtermRepository(db).findByCourseId(idCourse)
  },
  async findByCourseIdWithAllData(idCourse: string) {
    const data = await midtermRepository(db).findByCourseIdWithAllData(idCourse)
    return makeModules({ moduleList: data, type: 'midterms' })
  },
}
