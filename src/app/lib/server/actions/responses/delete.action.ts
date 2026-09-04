'use server';

import { v2 as cloudinary } from 'cloudinary';
import { revalidateTag } from 'next/cache';
import { cuid, object } from 'zod';
import db from '../../db/db';
import { userUseCases } from '../../usecases/user.usecases';
import createAction from '../createActions';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const schema = object({
  id: cuid(),
  idUser: cuid(),
});

export const deleteResponse = createAction(schema, async ({ id, idUser }) => {
  const session = await userUseCases.getSession();
  if (!session) throw new Error('No estas logueado');
  else if (session.user.id !== idUser && session.user.tier !== 2)
    throw new Error('No tienes permiso para eliminar esta respuesta');

  const response = await db.response.delete({
    where: {
      id: id,
    },
  });

  if (response.type == 'IMAGE' || response.type == 'PDF')
    await cloudinary.uploader.destroy(
      `${response.idTp ? 'tps' : 'parciales'}/respuestas/${response.idTp || response.idMidterm}/${response.number}/${idUser}`,
    );

  revalidateTag('responses', 'max');
  return response;
});
