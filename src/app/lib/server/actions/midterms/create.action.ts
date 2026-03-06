'use server'
import { object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { getServerUser } from '../users/get.server.user'

const schema = object({
  name: string().min(1),
  date: string().min(1),
  idCourse: string().min(1),
  idUser: string().min(1),
})

export const createMidterm = createAction(schema, async ({ name, date, idCourse, idUser }) => {
  const { user } = await getServerUser()
  if (!user) throw new Error('No estas logueado')

  return await db.midterm.create({
    data: {
      name: name,
      date: date,
      idCourse,
      idUser,
    },
  })
})
