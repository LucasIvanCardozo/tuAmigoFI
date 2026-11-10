'use server';

import { updateTag } from 'next/cache';
import { slugify } from '../../../../utils/slugify';
import {
  addResponseActionSchema,
  getResponseNumberError,
} from '../../../shared/schemas/response.schema';
import db from '../../db/db';
import type { TypeResponse } from '../../db/prisma/prismaClient/enums';
import { buildUploadMeta } from '../../uploadthing/meta';
import { userUseCases } from '../../usecases/user.usecases';
import { withUploadRollback } from '../../utils/uploadthing';
import createAction from '../createActions';

export const createResponse = createAction(
  addResponseActionSchema,
  async ({ idTp, idMidterm, number, allProblems, type, text, file }) => {
    if (idMidterm && idTp) throw new Error('No puedes tener un parcial y un TP');
    const session = await userUseCases.getSession();
    if (!session) throw new Error('Necesitas iniciar sesion!');
    const idUser = session.user.id;

    const isAllProblems = allProblems === true;
    if (isAllProblems && idTp) throw new Error('Las respuestas completas son solo para exámenes');
    const numberError = getResponseNumberError(number, isAllProblems);
    if (numberError) throw new Error(numberError);
    const responseNumber = isAllProblems ? 0 : (number ?? 0);

    const validation = isAllProblems
      ? await db.response.findFirst({
          where: {
            idTp,
            idMidterm,
            idUser,
            allProblems: true,
          },
        })
      : await db.response.findFirst({
          where: {
            idTp,
            idMidterm,
            idUser,
            number: responseNumber,
          },
        });

    if (validation) {
      throw new Error(
        isAllProblems
          ? 'Ya subiste la respuesta completa de este examen!'
          : 'No puedes tener mas de una respuesta a un problema!',
      );
    }

    if ((type === 'IMAGE' || type === 'PDF') && file) {
      let courseSlug: string | undefined;
      if (idTp) {
        const tp = await db.tp.findUnique({
          where: { id: idTp },
          select: { idCourse: true, courses: { select: { name: true } } },
        });
        courseSlug = tp ? slugify(tp.courses.name) || tp.idCourse : undefined;
      } else if (idMidterm) {
        const midterm = await db.midterm.findUnique({
          where: { id: idMidterm },
          select: { idCourse: true, courses: { select: { name: true } } },
        });
        courseSlug = midterm ? slugify(midterm.courses.name) || midterm.idCourse : undefined;
      }
      if (!courseSlug) throw new Error('No se encontró la materia');

      const response = await withUploadRollback(
        file,
        buildUploadMeta({ courseSlug, entityType: 'response' }),
        async (url, key) => {
          const created = await db.response.create({
            data: {
              idTp,
              idMidterm,
              number: responseNumber,
              allProblems: isAllProblems,
              type: type as TypeResponse,
              idUser,
              ...(text && { text: text }),
            },
          });
          return db.response.update({
            where: { id: created.id },
            data: { fileUrl: url, fileKey: key },
          });
        },
      );

      updateTag('responses');
      return response;
    }

    const response = await db.response.create({
      data: {
        idTp,
        idMidterm,
        number: responseNumber,
        allProblems: isAllProblems,
        type: type as TypeResponse,
        idUser,
        ...(text && { text: text }),
      },
    });

    updateTag('responses');
    return response;
  },
);
