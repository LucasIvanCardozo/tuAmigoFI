'use server'
import { cuid, object } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { userUseCases } from '../../usecases/user.usecases'
import { revalidateTag } from 'next/cache'

const schema = object({
  id: cuid(),
  idUser: cuid(),
})

export const deleteTp = createAction(schema, async ({ id, idUser }) => {
  const session = await userUseCases.getSession()
  if (!session) throw new Error('No estas logueado')
  if (session.user.id !== idUser && session.user.tier !== 2) throw new Error('No tienes permiso para eliminar este tp')

  const tp = await db.tp.findUnique({ where: { id } })
  if (!tp) throw new Error('TP no encontrado')

  const deleted = await db.tp.delete({
    where: {
      id,
    },
  })

  revalidateTag('tps', 'max')
  return deleted
})
