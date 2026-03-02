import { get } from 'http'
import { Prisma, PrismaClient } from '../prisma/prismaClient/client'

export const userRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  getById(id: string) {
    return db.user.findFirstOrThrow({ where: { id } })
  },
  getByEmail(email: string) {
    return db.user.findFirstOrThrow({ where: { email } })
  },
  findById(id: string) {
    return db.user.findFirst({ where: { id } })
  },
  findByEmail(email: string) {
    return db.user.findFirst({ where: { email } })
  },
  findContributors() {
    return db.user.findMany({
      include: {
        _count: {
          select: {
            comments: true,
            links: true,
            midterms: true,
            tps: true,
            reactions: true,
            responses: true,
          },
        },
      },
    })
  },
})
