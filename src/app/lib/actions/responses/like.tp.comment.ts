'use server';
import { z } from 'zod';
import createAction from '../createActions';
import prisma from '../../db';
import { getServerUser } from '../users/get.server.user';

const { object, number } = z;

const schema = object({
  comment_id: number().positive(),
});

export const likeTpComment = createAction(schema, async ({ comment_id }) => {
  const { user } = await getServerUser();
  if (!user) throw new Error('No estas logueado');

  const { id } = user;

  const like = await prisma.tps_comments_reactions.findFirst({
    where: {
      id_user: id,
      id_comment: comment_id,
    },
  });

  if (like) {
    await prisma.tps_comments_reactions.delete({
      where: {
        id: like.id,
      },
    });
    return null;
  }

  return await prisma.tps_comments_reactions.create({
    data: {
      id_user: id,
      id_comment: comment_id,
    },
  });
});
