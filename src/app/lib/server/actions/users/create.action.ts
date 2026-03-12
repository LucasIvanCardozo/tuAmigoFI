'use server'
import { cuid, email, object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { revalidateTag } from 'next/cache'

const schema = object({
  name: cuid(),
  email: email(),
  image: string().min(1),
})

export const createUser = createAction(schema, async ({ name, email, image }) => {
  const user = await db.user.create({
    data: {
      email: email,
      name: name,
      image: image,
      tier: 0,
      banned: false,
    },
  })
  revalidateTag('users', 'max')
  return user
})
