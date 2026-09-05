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
});

export const upsertReaction = createAction(schema, async ({ idTarget, typeTarget, reaction }) => {
  const session = await userUseCases.getSession();
  if (!session) throw new Error('Necesitas iniciar sesion!');
  const { id: idUser } = session.user;

  const existing = await db.reaction.findFirst({
    where: {
      idUser,
      idTarget,
    },
  });

  let reactionAux: Reaction;
  if (!existing) {
    reactionAux = await db.reaction.create({
      data: {
        idUser,
        idTarget,
        reaction,
        typeTarget,
      },
    });
  } else if (existing.reaction === reaction) {
    reactionAux = await db.reaction.delete({
      where: { id: existing.id },
    });
  } else {
    reactionAux = await db.reaction.update({
      where: { id: existing.id },
      data: { reaction },
    });
  }
  updateTag('reactions');
  return reactionAux;
});
