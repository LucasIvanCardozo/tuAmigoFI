'use server';

import { updateTag } from 'next/cache';
import { cuid, file, number, object, string } from 'zod';
import db from '../../db/db';
import { buildUploadMeta } from '../../uploadthing/meta';
import { userUseCases } from '../../usecases/user.usecases';
import { uploadFile } from '../../utils/uploadthing';
import createAction from '../createActions';

const schema = object({
  name: string().min(1),
  number: number().min(1),
  year: number().min(1),
  idUser: cuid(),
  idCourse: cuid(),
  file: file()
    .refine((file) => file.size < 5_000_000, 'Max 5MB')
    .refine(
      (file) =>
        file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png',
      'Solo PDF, JPEG o PNG',
    ),
});

export const createTp = createAction(
  schema,
  async ({ name, number, year, idUser, idCourse, file }) => {
    const session = await userUseCases.getSession();
    if (!session) throw new Error('Necesitas iniciar sesion!');

    const tp = await db.tp.create({
      data: {
        name: name,
        ...(number ? { number: number } : { number: 0 }),
        year: year,
        idUser,
        idCourse,
      },
    });

    const meta = buildUploadMeta({
      courseId: idCourse,
      entityType: 'tp',
      entityId: tp.id,
    });
    const upload = await uploadFile(file, meta);
    if (!upload.success) throw new Error(upload.error);
    const tpWithFile = await db.tp.update({
      where: { id: tp.id },
      data: { fileUrl: upload.url, fileKey: upload.fileKey },
    });

    updateTag('tps');
    return tpWithFile;
  },
);
