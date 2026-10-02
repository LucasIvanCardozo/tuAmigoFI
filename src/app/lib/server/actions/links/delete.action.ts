'use server';
import { updateTag } from 'next/cache';
import { cuid, object } from 'zod';
import db from '../../db/db';
import { userUseCases } from '../../usecases/user.usecases';
import createAction from '../createActions';

const schema = object({
  id: cuid(),
});

export const deleteLink = createAction(schema, async ({ id }) => {
  const session = await userUseCases.getSession();
  if (!session) throw new Error('Necesitas iniciar sesion!');

  const link = await db.link.findUnique({
    where: { id },
    select: { idUser: true },
  });
  if (!link) throw new Error('No existe el link');
  if (link.idUser !== session.user.id && session.user.tier !== 2)
    throw new Error('No tienes permiso para eliminar este tp');

  const deleted = await db.link.delete({
    where: {
      id,
    },
  });

  updateTag('links');
  return deleted;
});
