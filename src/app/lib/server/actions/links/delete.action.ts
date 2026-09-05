'use server';
import { updateTag } from 'next/cache';
import { cuid, object } from 'zod';
import db from '../../db/db';
import { userUseCases } from '../../usecases/user.usecases';
import createAction from '../createActions';

const schema = object({
  id: cuid(),
  idUser: cuid(),
});

export const deleteLink = createAction(schema, async ({ id, idUser }) => {
  const session = await userUseCases.getSession();
  if (!session) throw new Error('No estas logueado');
  if (session.user.id !== idUser && session.user.tier !== 2)
    throw new Error('No tienes permiso para eliminar este tp');

  const deleted = await db.link.delete({
    where: {
      id,
    },
  });

  updateTag('links');
  return deleted;
});
