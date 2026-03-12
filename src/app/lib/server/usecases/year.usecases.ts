import { cacheLife, cacheTag } from 'next/cache'
import db from '../db/db'
import { yearRepository } from '../db/repository/year.repository'

export const yearUseCases = {
  async findAll() {
    'use cache: remote'
    cacheLife('weeks')
    cacheTag('years')
    return yearRepository(db).findAll()
  },
}
