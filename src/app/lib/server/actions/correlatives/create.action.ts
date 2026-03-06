'use server'
import { object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { getServerUser } from '../users/get.server.user'

const schema = object({
  idCourse: string().min(1),
  idCorrelativeCourse: string().min(1),
})

export const createCorrelative = createAction(schema, async ({ idCourse, idCorrelativeCourse }) => {
  const { user } = await getServerUser()
  if (!user) throw new Error('No estas logueado')

  return db.correlative.create({
    data: {
      idCourse,
      idCorrelativeCourse,
    },
  })
})
