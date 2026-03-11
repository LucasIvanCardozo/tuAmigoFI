import { cacheLife, cacheTag } from 'next/cache'
import db from '../db/db'
import { linkRepository } from '../db/repository/link.repository'

export const linkUseCases = {
  async findByCourseId(idCourse: string) {
    'use cache'
    cacheLife('weeks')
    cacheTag('links')
    return linkRepository(db).findByCourseId(idCourse)
  },
}
