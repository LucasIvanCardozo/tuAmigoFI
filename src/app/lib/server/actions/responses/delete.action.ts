'use server';

import { updateTag } from 'next/cache';
import { cuid, object } from 'zod';
import db from '../../db/db';
import { userUseCases } from '../../usecases/user.usecases';
import { deleteUploadThingFile } from '../../utils/uploadthing';
import createAction from '../createActions';

const schema = object({
  id: cuid(),
  idUser: cuid(),
});

export const deleteResponse = createAction(schema, async ({ id, idUser }) => {
  const session = await userUseCases.getSession();
  if (!session) throw new Error('No estas logueado');
  else if (session.user.id !== idUser && session.user.tier !== 2)
    throw new Error('No tienes permiso para eliminar esta respuesta');

  const existing = await db.response.findUnique({
    where: { id },
    select: { type: true, fileKey: true },
  });
  if (!existing) throw new Error('No existe la respuesta');
  if ((existing.type === 'IMAGE' || existing.type === 'PDF') && existing.fileKey) {
    await deleteUploadThingFile(existing.fileKey);
  }

  const response = await db.response.delete({
    where: {
      id: id,
    },
  });

  updateTag('responses');
  return response;
});
