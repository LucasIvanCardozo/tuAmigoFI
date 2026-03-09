'use server'
import { object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { getSession } from '../users/get.server.user'

const schema = object({
  idCourse: string().min(1),
  idCorrelativeCourse: string().min(1),
})

export const createCorrelative = createAction(schema, async ({ idCourse, idCorrelativeCourse }) => {
  const session = await getSession()
  if (!session) throw new Error('No estas logueado')

  return db.correlative.create({
    data: {
      idCourse,
      idCorrelativeCourse,
    },
  })
})
