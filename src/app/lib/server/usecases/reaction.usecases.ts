import db from '../db/db'
import { reactionRepository } from '../db/repository/reaction.repository'

export const reactionUseCases = {
  findByResponseId(idResponse: string) {
    return reactionRepository(db).findByResponseId(idResponse)
  },
}
