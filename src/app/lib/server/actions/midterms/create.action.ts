'use server';

import { updateTag } from 'next/cache';
import { cuid, file, object, string } from 'zod';
import db from '../../db/db';
import { buildUploadMeta } from '../../uploadthing/meta';
import { userUseCases } from '../../usecases/user.usecases';
import { uploadFile } from '../../utils/uploadthing';
import createAction from '../createActions';

const schema = object({
  name: string().min(1),
  date: string().min(1),
  idCourse: cuid(),
  idUser: cuid(),
  file: file()
    .refine((file) => file.size < 5_000_000, 'Max 5MB')
    .refine(
      (file) =>
        file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png',
      'Solo PDF, JPEG o PNG',
    ),
});

export const createMidterm = createAction(
  schema,
  async ({ name, date, idCourse, idUser, file }) => {
    const session = await userUseCases.getSession();
    if (!session) throw new Error('No estas logueado');

    const midterm = await db.midterm.create({
      data: {
        name: name,
        date: date,
        idCourse,
        idUser,
      },
    });

    const meta = buildUploadMeta({
      courseId: idCourse,
      entityType: 'midterm',
      entityId: midterm.id,
    });
    const upload = await uploadFile(file, meta);
    if (!upload.success) throw new Error(upload.error);
    const midtermWithFile = await db.midterm.update({
      where: { id: midterm.id },
      data: { fileUrl: upload.url, fileKey: upload.fileKey },
    });

    updateTag('midterms');
    return midtermWithFile;
  },
);
