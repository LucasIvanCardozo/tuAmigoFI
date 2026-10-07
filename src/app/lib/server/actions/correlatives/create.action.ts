'use server';
import { updateTag } from 'next/cache';
import { cuid, object } from 'zod';
import db from '../../db/db';
import { userUseCases } from '../../usecases/user.usecases';
import createAction from '../createActions';

const schema = object({
  idCourse: cuid(),
  idCorrelativeCourse: cuid(),
});

export const createCorrelative = createAction(schema, async ({ idCourse, idCorrelativeCourse }) => {
  const session = await userUseCases.getSession();
  if (!session) throw new Error('Necesitas iniciar sesion!');
  if (session.user.tier < 1)
    throw new Error('Debes tener un rango superior para añadir correlativas');

  const correlatives = await db.correlative.create({
    data: {
      idCourse,
      idCorrelativeCourse,
    },
  });
  updateTag('correlatives');
  return correlatives;
});
