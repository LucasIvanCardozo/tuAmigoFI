import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const reactionRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  findAllResponses() {
    return db.reaction.findMany({
      where: { typeTarget: 'RESPONSE' },
    })
  },
  findAllComments() {
    return db.reaction.findMany({
      where: { typeTarget: 'COMMENT' },
    })
  },
  findAllTps() {
    return db.reaction.findMany({
      where: { typeTarget: 'TP' },
    })
  },
  findAllMidterms() {
    return db.reaction.findMany({
      where: { typeTarget: 'MIDTERM' },
    })
  },
  findAllLinks() {
    return db.reaction.findMany({
      where: { typeTarget: 'LINK' },
    })
  },
})
