import type { Prisma, PrismaClient } from '../prisma/prismaClient/client';

export const userRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  getById(id: string) {
    return db.user.findFirstOrThrow({ where: { id } });
  },
  getByEmail(email: string) {
    return db.user.findFirstOrThrow({ where: { email } });
  },
  findById(id: string) {
    return db.user.findFirst({ where: { id } });
  },
  findByEmail(email: string) {
    return db.user.findFirst({ where: { email } });
  },
  upsertByEmail(data: { name: string; email: string; image: string }) {
    return db.user.upsert({
      where: { email: data.email },
      update: { name: data.name, image: data.image },
      create: { ...data, tier: 0, banned: false },
    });
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
    });
  },
});
