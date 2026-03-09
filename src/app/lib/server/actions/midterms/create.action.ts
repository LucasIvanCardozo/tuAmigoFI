'use server'
import { object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { getSession } from '../users/get.server.user'

const schema = object({
  name: string().min(1),
  date: string().min(1),
  idCourse: string().min(1),
  idUser: string().min(1),
})

export const createMidterm = createAction(schema, async ({ name, date, idCourse, idUser }) => {
  const session = await getSession()
  if (!session) throw new Error('No estas logueado')

  return db.midterm.create({
    data: {
      name: name,
      date: date,
      idCourse,
      idUser,
    },
  })
})
