'use server'
import { cuid, object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { userUseCases } from '../../usecases/user.usecases'
import { revalidateTag } from 'next/cache'

const schema = object({
  name: string().min(1),
  date: string().min(1),
  idCourse: cuid(),
  idUser: cuid(),
})

export const createMidterm = createAction(schema, async ({ name, date, idCourse, idUser }) => {
  const session = await userUseCases.getSession()
  if (!session) throw new Error('No estas logueado')

  const midterm = await db.midterm.create({
    data: {
      name: name,
      date: date,
      idCourse,
      idUser,
    },
  })

  revalidateTag(`midterms`, 'max')
  return midterm
})
