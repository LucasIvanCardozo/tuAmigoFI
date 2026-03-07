import { makeModules } from '@/app/utils/makeModules'
import db from '../db/db'
import { tpRepository } from '../db/repository/tp.repository'
import { reactionUseCases } from './reaction.usecases'

export const tpUseCases = {
  findByCourseId: (idCourse: string) => {
    return tpRepository(db).findByCourseId(idCourse)
  },
  findByCourseIdWithAllData: async (idCourse: string) => {
    const moduleList = await tpRepository(db).findByCourseIdWithAllData(idCourse)
    const reactions = await reactionUseCases.findSplitAll()
    return makeModules({ moduleList, reactions, type: 'tp' })
  },
}
