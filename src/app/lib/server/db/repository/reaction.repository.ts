import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const reactionRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  findByResponseId(idResponse: string) {
    return db.reaction.findMany({
      where: { idTarget: idResponse, typeTarget: 'RESPONSE' },
    })
  },// no se si esta bien
  
})
