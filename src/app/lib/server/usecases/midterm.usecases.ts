import { makeModules } from '@/app/utils/makeModules'
import db from '../db/db'
import { midtermRepository } from '../db/repository/midterm.repository'
import { reactionUseCases } from './reaction.usecases'
import { cacheLife, cacheTag } from 'next/cache'

export const midtermUseCases = {
  async findByCourseId(idCourse: string) {
    'use cache: remote'
    cacheLife('days')
    cacheTag('midterms')
    return midtermRepository(db).findByCourseId(idCourse)
  },
  async findByCourseIdWithAllData(idCourse: string) {
    'use cache: remote'
    cacheLife('days')
    cacheTag('midterms')
    const moduleList = await midtermRepository(db).findByCourseIdWithAllData(idCourse)
    const reactions = await reactionUseCases.findSplitAll()
    return makeModules({ moduleList, reactions, type: 'midterm' })
  },
}
