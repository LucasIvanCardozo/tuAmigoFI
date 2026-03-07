import { makeModules } from '@/app/utils/makeModules'
import db from '../db/db'
import { midtermRepository } from '../db/repository/midterm.repository'
import { reactionUseCases } from './reaction.usecases'

export const midtermUseCases = {
  findByCourseId(idCourse: string) {
    return midtermRepository(db).findByCourseId(idCourse)
  },
  async findByCourseIdWithAllData(idCourse: string) {
    const moduleList = await midtermRepository(db).findByCourseIdWithAllData(idCourse)
    const reactions = await reactionUseCases.findSplitAll()
    return makeModules({ moduleList, reactions, type: 'midterm' })
  },
}
