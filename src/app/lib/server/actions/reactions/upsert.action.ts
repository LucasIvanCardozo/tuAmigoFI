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

    let reactionAux: Reaction | null;
    if (!existing) {
      reactionAux =
        intent === 'unset'
          ? null
          : await db.reaction.create({
              data: {
                idUser,
                idTarget,
                reaction,
                typeTarget,
              },
            });
    } else if (intent === 'set') {
      reactionAux =
        existing.reaction === reaction
          ? existing
          : await db.reaction.update({
              where: { id: existing.id },
              data: { reaction },
            });
    } else if (intent === 'unset') {
      reactionAux =
        existing.reaction === reaction
          ? await db.reaction.delete({
              where: { id: existing.id },
            })
          : existing;
    } else {
      reactionAux =
        existing.reaction === reaction
          ? await db.reaction.delete({
              where: { id: existing.id },
            })
          : await db.reaction.update({
              where: { id: existing.id },
              data: { reaction },
            });
    }
    updateTag('reactions');
    return { reaction: reactionAux, previous: existing?.reaction ?? null };
  },
);
