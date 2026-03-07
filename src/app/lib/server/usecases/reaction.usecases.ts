import db from '../db/db'
import { reactionRepository } from '../db/repository/reaction.repository'

export const reactionUseCases = {
  async findSplitAll() {
    const [responseReactions, commentReactions, tpReactions, midtermReactions, linkReactions] = await Promise.all([
      reactionRepository(db).findAllResponses(),
      reactionRepository(db).findAllComments(),
      reactionRepository(db).findAllTps(),
      reactionRepository(db).findAllMidterms(),
      reactionRepository(db).findAllLinks(),
    ])

    return { responseReactions, commentReactions, tpReactions, midtermReactions, linkReactions }
  },
}
