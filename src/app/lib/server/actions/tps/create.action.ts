'use server';

import { updateTag } from 'next/cache';
import { slugify } from '../../../../utils/slugify';
import { addTpActionSchema } from '../../../shared/schemas/tp.schema';
import db from '../../db/db';
import { buildUploadMeta } from '../../uploadthing/meta';
import { courseUseCases } from '../../usecases/course.usecases';
import { userUseCases } from '../../usecases/user.usecases';
import { withUploadRollback } from '../../utils/uploadthing';
import createAction from '../createActions';

export const createTp = createAction(
  addTpActionSchema,
  async ({ name, number, year, idCourse, file }) => {
    const session = await userUseCases.getSession();
    if (!session) throw new Error('Necesitas iniciar sesion!');
    const idUser = session.user.id;
    const course = await courseUseCases.getById(idCourse);
    const courseSlug = slugify(course.name) || course.id;

    const tp = await withUploadRollback(
      file,
      buildUploadMeta({ courseSlug, entityType: 'tp' }),
      async (url, key) => {
        const created = await db.tp.create({
          data: {
            name: name,
            ...(number ? { number: number } : { number: 0 }),
            year: year,
            idUser,
            idCourse,
          },
        });
        return db.tp.update({
          where: { id: created.id },
          data: { fileUrl: url, fileKey: key },
        });
      },
    );

    updateTag('tps');
    return tp;
  },
);
