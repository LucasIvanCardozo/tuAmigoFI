import { cacheLife, cacheTag } from 'next/cache'
import db from '../db/db'
import { responseRepository } from '../db/repository/response.respository'

export const responseUseCases = {
  async findFromTp(idTp: string) {
    'use cache: remote'
    cacheLife('days')
    cacheTag('responses')
    return responseRepository(db).findFromTp(idTp)
  },
  async findFromMidterm(idMidterm: string) {
    'use cache: remote'
    cacheLife('days')
    cacheTag('responses')
    return responseRepository(db).findFromMidterm(idMidterm)
  },
}
