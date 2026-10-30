import type { Prisma, PrismaClient } from '../prisma/prismaClient/client';

export const userRepository = (db: PrismaClient | Prisma.TransactionClient) => ({
  getById(id: string) {
    return db.user.findUniqueOrThrow({ where: { id } });
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
  async findLikesReceivedCounts() {
    const rows = await db.$queryRaw<{ id: string; total: number }[]>`
      WITH likes AS (
        SELECT target.id_user AS author, reaction.id_user AS reactor
        FROM "Reaction" reaction
        JOIN "Response" target ON target.id = reaction.id_target
        WHERE reaction."typeTarget"::text = 'RESPONSE' AND reaction.reaction = true
        UNION ALL
        SELECT target.id_user, reaction.id_user
        FROM "Reaction" reaction
        JOIN "Comment" target ON target.id = reaction.id_target
        WHERE reaction."typeTarget"::text = 'COMMENT' AND reaction.reaction = true
        UNION ALL
        SELECT target.id_user, reaction.id_user
        FROM "Reaction" reaction
        JOIN "Tp" target ON target.id = reaction.id_target
        WHERE reaction."typeTarget"::text = 'TP' AND reaction.reaction = true
        UNION ALL
        SELECT target.id_user, reaction.id_user
        FROM "Reaction" reaction
        JOIN "Midterm" target ON target.id = reaction.id_target
        WHERE reaction."typeTarget"::text = 'MIDTERM' AND reaction.reaction = true
      )
      SELECT author AS id, COUNT(*)::int AS total
      FROM likes
      WHERE author <> reactor
      GROUP BY author
    `;

    const counts: Record<string, number> = {};
    for (const row of rows) counts[row.id] = row.total;
    return counts;
  },
});
