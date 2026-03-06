import { makeModules } from '@/app/utils/makeModules'
import db from '../db/db'
import { tpRepository } from '../db/repository/tp.repository'

export const tpUseCases = {
  findByCourseId: (idCourse: string) => {
    return tpRepository(db).findByCourseId(idCourse)
  },
  findByCourseIdWithAllData: async (idCourse: string) => {
    const data = await tpRepository(db).findByCourseIdWithAllData(idCourse)
    return makeModules({ moduleList: data, type: 'tps' })
  },
}
