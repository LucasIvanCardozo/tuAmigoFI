'use server'
import { number, object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { getSession } from '../users/get.server.user'

const schema = object({
  name: string().min(1),
  number: number().min(1),
  year: number().min(1),
  idUser: string().min(1),
  idCourse: string().min(1),
})

export const createTp = createAction(schema, async ({ name, number, year, idUser, idCourse }) => {
  const { user } = await getSession()
  if (!user) throw new Error('No estas logueado')
  return db.tp.create({
    data: {
      name: name,
      ...(number ? { number: number } : { number: 0 }),
      year: year,
      idUser,
      idCourse,
    },
  })
})
