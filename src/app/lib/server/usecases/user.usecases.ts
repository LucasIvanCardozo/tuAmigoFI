import { cacheLife, cacheTag } from 'next/cache';
import { getServerSession } from 'next-auth';
import { buildScoreBreakdown, computeScore, type ScoreCounts } from '@/app/lib/shared/score';
import { authOptions } from '../auth/authOptions';
import db from '../db/db';
import type { User } from '../db/prisma/prismaClient/client';
import { userRepository } from '../db/repository/user.repository';

export const userUseCases = {
  async getById(id: string) {
    return userRepository(db).getById(id);
  },
  async getByEmail(email: string) {
    'use cache: remote';
    cacheLife('hours');
    cacheTag('users');
    return userRepository(db).getByEmail(email);
  },
  async findById(id: string) {
    'use cache: remote';
    cacheLife('hours');
    cacheTag('users');
    return userRepository(db).findById(id);
  },
  async findByEmail(email: string) {
    'use cache: remote';
    cacheLife('hours');
    cacheTag('users');
    return userRepository(db).findByEmail(email);
  },
  async ensureByEmail(data: { name: string; email: string; image: string }) {
    return userRepository(db).upsertByEmail(data);
  },
  async findContributorsWithScore() {
    'use cache: remote';
    cacheLife('hours');
    cacheTag('users', 'tps', 'midterms', 'responses', 'comments', 'links', 'reactions');
    const contributors = await userRepository(db).findContributors();
    const data = contributors.flatMap((user) => {
      const { comments, links, midterms, reactions, responses, tps } = user._count;
      const score = computeScore({ comments, links, midterms, reactions, responses, tps });
      return score
        ? ({
            user,
            score,
          } as ContributorsFullType)
        : [];
    });
    return data.sort((a, b) => b.score - a.score);
  },
  async findContributions(idUser: string) {
    'use cache: remote';
    cacheLife('hours');
    cacheTag('users', 'tps', 'midterms', 'responses', 'comments', 'links', 'reactions');
    const user = await db.user.findUnique({
      where: { id: idUser },
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
    if (!user) return null;
    const counts: ScoreCounts = {
      comments: user._count.comments,
      links: user._count.links,
      midterms: user._count.midterms,
      reactions: user._count.reactions,
      responses: user._count.responses,
      tps: user._count.tps,
    };
    return {
      name: user.name,
      score: computeScore(counts),
      breakdown: buildScoreBreakdown(counts),
    };
  },
  async getSession() {
    const session = await getServerSession(authOptions);
    return session;
  },
};

export type ContributorsFullType = {
  user: User;
  score: number;
};
