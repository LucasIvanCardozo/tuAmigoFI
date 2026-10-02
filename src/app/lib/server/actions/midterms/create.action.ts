'use server';

import { updateTag } from 'next/cache';
import { cuid, file, object, string } from 'zod';
import { slugify } from '../../../../utils/slugify';
import db from '../../db/db';
import { buildUploadMeta } from '../../uploadthing/meta';
import { courseUseCases } from '../../usecases/course.usecases';
import { userUseCases } from '../../usecases/user.usecases';
import { withUploadRollback } from '../../utils/uploadthing';
import createAction from '../createActions';

const schema = object({
  name: string().min(1),
  date: string().min(1),
  idCourse: cuid(),
  file: file()
    .refine((file) => file.size < 5_000_000, 'Max 5MB')
    .refine(
      (file) =>
        file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png',
      'Solo PDF, JPEG o PNG',
    ),
});

export const createMidterm = createAction(schema, async ({ name, date, idCourse, file }) => {
  const session = await userUseCases.getSession();
  if (!session) throw new Error('Necesitas iniciar sesion!');
  const idUser = session.user.id;
  const course = await courseUseCases.getById(idCourse);
  const courseSlug = slugify(course.name) || course.id;

  const midterm = await withUploadRollback(
    file,
    buildUploadMeta({ courseSlug, entityType: 'midterm' }),
    async (url, key) => {
      const created = await db.midterm.create({
        data: {
          name: name,
          date: date,
          idCourse,
          idUser,
        },
      });
      return db.midterm.update({
        where: { id: created.id },
        data: { fileUrl: url, fileKey: key },
      });
    },
  );

  updateTag('midterms');
  return midterm;
});
