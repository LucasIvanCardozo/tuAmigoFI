import { makeModules } from '@/app/utils/makeModules'
import db from '../db/db'
import { tpRepository } from '../db/repository/tp.repository'
import { reactionUseCases } from './reaction.usecases'
import { cacheLife, cacheTag } from 'next/cache'

export const tpUseCases = {
  async findByCourseId(idCourse: string) {
    'use cache'
    cacheLife('days')
    cacheTag('tps')
    return tpRepository(db).findByCourseId(idCourse)
  },
  async findByCourseIdWithAllData(idCourse: string) {
    'use cache'
    cacheLife('days')
    cacheTag('tps')
    const moduleList = await tpRepository(db).findByCourseIdWithAllData(idCourse)
    const reactions = await reactionUseCases.findSplitAll()
    return makeModules({ moduleList, reactions, type: 'tp' })
  },
}
