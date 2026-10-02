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

export const deleteMidterm = createAction(schema, async ({ id }) => {
  const session = await userUseCases.getSession();
  if (!session) throw new Error('Necesitas iniciar sesion!');

  const midterm = await db.midterm.findUnique({
    where: { id },
    select: { idUser: true, fileKey: true, responses: { select: { fileKey: true } } },
  });
  if (!midterm) throw new Error('No existe el examen');
  if (midterm.idUser !== session.user.id && session.user.tier !== 2)
    throw new Error('No tienes permiso para eliminar este tp');
  for (const r of midterm.responses) {
    if (r.fileKey) await deleteUploadThingFile(r.fileKey);
  }
  if (midterm.fileKey) await deleteUploadThingFile(midterm.fileKey);

  const deleted = await db.midterm.delete({
    where: {
      id: id,
    },
  });
  updateTag('midterms');
  return deleted;
});
