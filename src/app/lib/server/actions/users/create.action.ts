'use server';
import { revalidateTag } from 'next/cache';
import { email, object, string } from 'zod';
import db from '../../db/db';
import createAction from '../createActions';

const schema = object({
  name: string().min(1),
  email: email(),
  image: string().min(1),
});

export const createUser = createAction(schema, async ({ name, email, image }) => {
  const user = await db.user.create({
    data: {
      email: email,
      name: name,
      image: image,
      tier: 0,
      banned: false,
    },
  });
  revalidateTag('users', 'max');
  return user;
});
