'use server'
import { cuid, number, object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { userUseCases } from '../../usecases/user.usecases'
import { revalidateTag } from 'next/cache'

const schema = object({
  name: string().min(1),
  number: number().min(1),
  year: number().min(1),
  idUser: cuid(),
  idCourse: cuid(),
})

export const createTp = createAction(schema, async ({ name, number, year, idUser, idCourse }) => {
  const session = await userUseCases.getSession()
  if (!session) throw new Error('No estas logueado')

  const tp = await db.tp.create({
    data: {
      name: name,
      ...(number ? { number: number } : { number: 0 }),
      year: year,
      idUser,
      idCourse,
    },
  })

  revalidateTag('tps', 'max')
  return tp
})
