import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const commentRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  findLastsByUserId(idUser: string) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    return db.comment.findMany({
      where: {
        idUser,
        createdAt: {
          gte: oneDayAgo,
        },
      },
    })
  },
})
