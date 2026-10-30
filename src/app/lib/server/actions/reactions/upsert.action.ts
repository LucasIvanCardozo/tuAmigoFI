'use server';
import { updateTag } from 'next/cache';
import z, { boolean, cuid, object } from 'zod';
import db from '../../db/db';
import { ReactionTo } from '../../db/prisma/prismaClient/enums';
import { userUseCases } from '../../usecases/user.usecases';
import createAction from '../createActions';

type ReactionToType = (typeof ReactionTo)[keyof typeof ReactionTo];

const schema = object({
  idTarget: cuid(),
  typeTarget: z.enum(Object.values(ReactionTo) as [ReactionToType, ...ReactionToType[]]),
  reaction: boolean(),
});

export const upsertReaction = createAction(
  schema,
  async ({
    idTarget,
    typeTarget,
    reaction,
  }): Promise<{
    reaction: boolean | null;
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
      await db.reaction.create({
        data: {
          idUser,
          idTarget,
          reaction,
          typeTarget,
        },
      });
    } else if (existing.reaction === reaction) {
      const deleted = await db.reaction.deleteMany({
        where: { id: existing.id, reaction: existing.reaction },
      });
      if (deleted.count === 0)
        throw new Error('El contenido cambio mientras lo guardabas, intenta de nuevo.');
      updateTag('reactions');
      return { reaction: null, previous: existing.reaction };
    } else {
      const updated = await db.reaction.updateMany({
        where: { id: existing.id, reaction: existing.reaction },
        data: { reaction },
      });
      if (updated.count === 0)
        throw new Error('El contenido cambio mientras lo guardabas, intenta de nuevo.');
    }

    updateTag('reactions');
    return { reaction, previous: existing?.reaction ?? null };
  },
);
