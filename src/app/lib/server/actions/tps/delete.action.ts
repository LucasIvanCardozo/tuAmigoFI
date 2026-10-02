'use server';
import { updateTag } from 'next/cache';
import { cuid, object } from 'zod';
import db from '../../db/db';
import { userUseCases } from '../../usecases/user.usecases';
import { deleteUploadThingFile } from '../../utils/uploadthing';
import createAction from '../createActions';

const schema = object({
  id: cuid(),
});

export const deleteTp = createAction(schema, async ({ id }) => {
  const session = await userUseCases.getSession();
  if (!session) throw new Error('Necesitas iniciar sesion!');

  const tp = await db.tp.findUnique({
    where: { id },
    select: { idUser: true, fileKey: true, responses: { select: { fileKey: true } } },
  });
  if (!tp) throw new Error('No existe el TP');
  if (tp.idUser !== session.user.id && session.user.tier !== 2)
    throw new Error('No tienes permiso para eliminar este tp');
  for (const r of tp.responses) {
    if (r.fileKey) await deleteUploadThingFile(r.fileKey);
  }
  if (tp.fileKey) await deleteUploadThingFile(tp.fileKey);

  const deleted = await db.tp.delete({
    where: {
      id,
    },
  });

  updateTag('tps');
  return deleted;
});
