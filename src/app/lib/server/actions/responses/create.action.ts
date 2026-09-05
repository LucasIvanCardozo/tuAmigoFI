'use server';

import { updateTag } from 'next/cache';
import z, { cuid, file, number, string } from 'zod';
import db from '../../db/db';
import { TypeResponse } from '../../db/prisma/prismaClient/enums';
import { buildUploadMeta } from '../../uploadthing/meta';
import { userUseCases } from '../../usecases/user.usecases';
import { withUploadRollback } from '../../utils/uploadthing';
import createAction from '../createActions';

const schema = z
  .object({
    idUser: cuid(),
    idTp: cuid().nullable().optional(),
    idMidterm: cuid().nullable().optional(),
    number: number().min(1),
    type: z.enum(Object.values(TypeResponse) as [string, ...string[]]),
    text: string().min(1).nullable().optional(),
    file: file()
      .refine((file) => file.size < 5_000_000, 'Max 5MB')
      .refine(
        (file) =>
          file.type === 'application/pdf' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/png',
        'Solo PDF, JPEG o PNG',
      )
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    const hasTp = Boolean(data.idTp);
    const hasMid = Boolean(data.idMidterm);

    if (hasTp === hasMid) {
      ctx.addIssue({
        code: 'custom',
        message: 'Debe existir idTp o idMidterm, pero no ambos',
      });
    }
  });

export const createResponse = createAction(
  schema,
  async ({ idUser, idTp, idMidterm, number, type, text, file }) => {
    if (idMidterm && idTp) throw new Error('No puedes tener un parcial y un tp');
    const session = await userUseCases.getSession();
    if (!session) throw new Error('Necesitas iniciar sesion!');

    const validation = await db.response.findFirst({
      where: {
        idTp,
        idMidterm,
        idUser,
        number,
      },
    });
    if (!validation) {
      if ((type === 'IMAGE' || type === 'PDF') && file) {
        let courseId: string | undefined;
        if (idTp) {
          const tp = await db.tp.findUnique({
            where: { id: idTp },
            select: { idCourse: true },
          });
          courseId = tp?.idCourse;
        } else if (idMidterm) {
          const midterm = await db.midterm.findUnique({
            where: { id: idMidterm },
            select: { idCourse: true },
          });
          courseId = midterm?.idCourse;
        }
        if (!courseId) throw new Error('No se encontró la materia');

        const response = await withUploadRollback(
          file,
          buildUploadMeta({ courseId, entityType: 'response', entityId: '__pending__' }),
          async (url, key) => {
            const created = await db.response.create({
              data: {
                idTp,
                number,
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
          number,
          type: type as TypeResponse,
          idUser,
          ...(text && { text: text }),
        },
      });

      updateTag('responses');
      return response;
    } else throw new Error('No puedes tener mas de una respueste a un problema!');
  },
);
