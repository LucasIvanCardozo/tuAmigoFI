'use server'
import { cuid, object } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { userUseCases } from '../../usecases/user.usecases'
import { revalidateTag } from 'next/cache'

const schema = object({
  idCourse: cuid(),
  idCorrelativeCourse: cuid(),
})

export const createCorrelative = createAction(schema, async ({ idCourse, idCorrelativeCourse }) => {
  const session = await userUseCases.getSession()
  if (!session) throw new Error('No estas logueado')

  const correlatives = await db.correlative.create({
    data: {
      idCourse,
      idCorrelativeCourse,
    },
  })
  revalidateTag('correlatives', 'max')
  return correlatives
})
