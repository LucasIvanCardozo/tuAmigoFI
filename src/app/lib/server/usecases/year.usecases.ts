import db from '../db/db'
import { yearRepository } from '../db/repository/year.repository'

export const yearUseCases = {
  findAll() {
    return yearRepository(db).findAll()
  },
}
