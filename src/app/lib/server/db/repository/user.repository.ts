import type { Prisma, PrismaClient } from '../prisma/prismaClient/client';
import { ReactionTo } from '../prisma/prismaClient/enums';

const LIKE_TARGETS = [
  ReactionTo.RESPONSE,
  ReactionTo.COMMENT,
  ReactionTo.TP,
  ReactionTo.MIDTERM,
] as const;

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
    const likes = await db.reaction.findMany({
      where: { reaction: true, typeTarget: { in: [...LIKE_TARGETS] } },
      select: { idTarget: true, typeTarget: true },
    });

    const targetsByType = new Map<string, string[]>();
    for (const like of likes) {
      const targets = targetsByType.get(like.typeTarget);
      if (targets) targets.push(like.idTarget);
      else targetsByType.set(like.typeTarget, [like.idTarget]);
    }

    const [responses, comments, tps, midterms] = await Promise.all([
      db.response.findMany({
        where: { id: { in: targetsByType.get(ReactionTo.RESPONSE) ?? [] } },
        select: { id: true, idUser: true },
      }),
      db.comment.findMany({
        where: { id: { in: targetsByType.get(ReactionTo.COMMENT) ?? [] } },
        select: { id: true, idUser: true },
      }),
      db.tp.findMany({
        where: { id: { in: targetsByType.get(ReactionTo.TP) ?? [] } },
        select: { id: true, idUser: true },
      }),
      db.midterm.findMany({
        where: { id: { in: targetsByType.get(ReactionTo.MIDTERM) ?? [] } },
        select: { id: true, idUser: true },
      }),
    ]);

    const authorByTarget = new Map<string, string>();
    const register = (items: { id: string; idUser: string }[], typeTarget: string) => {
      for (const item of items) authorByTarget.set(`${typeTarget}:${item.id}`, item.idUser);
    };
    register(responses, ReactionTo.RESPONSE);
    register(comments, ReactionTo.COMMENT);
    register(tps, ReactionTo.TP);
    register(midterms, ReactionTo.MIDTERM);

    const counts: Record<string, number> = {};
    for (const like of likes) {
      const author = authorByTarget.get(`${like.typeTarget}:${like.idTarget}`);
      if (!author) continue;
      counts[author] = (counts[author] ?? 0) + 1;
    }
    return counts;
  },
});
