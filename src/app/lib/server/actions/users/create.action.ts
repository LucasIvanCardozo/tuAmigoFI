'use server'
import { object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'

const schema = object({
  name: string().min(1),
  email: string().email(),
  image: string().min(1),
})

export const createUser = createAction(schema, async ({ name, email, image }) => {
  return db.user.create({
    data: {
      email: email,
      name: name,
      image: image,
      tier: 0,
      banned: false,
    },
  })
})
