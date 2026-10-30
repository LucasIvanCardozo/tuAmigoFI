'use server';
import { updateTag } from 'next/cache';
import z, { boolean, cuid, object } from 'zod';
import db from '../../db/db';
import type { Reaction } from '../../db/prisma/prismaClient/client';
import { ReactionTo } from '../../db/prisma/prismaClient/enums';
import { userUseCases } from '../../usecases/user.usecases';
import createAction from '../createActions';

type ReactionToType = (typeof ReactionTo)[keyof typeof ReactionTo];

const schema = object({
  idTarget: cuid(),
  typeTarget: z.enum(Object.values(ReactionTo) as [ReactionToType, ...ReactionToType[]]),
  reaction: boolean(),
  intent: z.enum(['toggle', 'set', 'unset']).optional(),
});

export const upsertReaction = createAction(
  schema,
  async ({
    idTarget,
    typeTarget,
    reaction,
    intent = 'toggle',
  }): Promise<{
    reaction: Reaction | null;
    previous: boolean | null;
  }> => {
    const session = await userUseCases.getSession();
    if (!session) throw new Error('Necesitas iniciar sesion!');
    const { id: idUser } = session.user;

    const existing = await db.reaction.findFirst({
      where: {
        idUser,
        idTarget,
        typeTarget,
      },
    });

    if (!existing) {
      if (intent !== 'unset') {
        await db.reaction.create({
          data: {
            idUser,
            idTarget,
            reaction,
            typeTarget,
          },
        });
      }
    } else if (intent === 'set') {
      await db.reaction.updateMany({
        where: { id: existing.id, reaction: existing.reaction },
        data: { reaction },
      });
    } else if (intent === 'unset') {
      await db.reaction.deleteMany({
        where: { id: existing.id, reaction },
      });
    } else {
      await db.reaction.deleteMany({
        where: { id: existing.id, reaction: existing.reaction },
      });
      if (existing.reaction !== reaction) {
        await db.reaction.updateMany({
          where: { id: existing.id, reaction: existing.reaction },
          data: { reaction },
        });
      }
    }

    const current = await db.reaction.findFirst({
      where: {
        idUser,
        idTarget,
        typeTarget,
      },
    });
    updateTag('reactions');
    return { reaction: current, previous: existing?.reaction ?? null };
  },
);
