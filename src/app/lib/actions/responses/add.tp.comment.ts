'use server';
import { z } from 'zod';
import createAction from '../createActions';
import prisma from '../../db';
import { getServerUser } from '../users/get.server.user';

const { object, number, string } = z;
const schema = object({
  response_id: number().positive(),
  text: string().min(1),
});

export const addTpComment = createAction(
  schema,
  async ({ response_id, text }) => {
    const { user } = await getServerUser();
    if (!user) throw new Error('No estas logueado');

    return await prisma.tps_comments.create({
      data: {
        id_response: response_id,
        text,
        id_user: user.id,
      },
    });
  }
);
