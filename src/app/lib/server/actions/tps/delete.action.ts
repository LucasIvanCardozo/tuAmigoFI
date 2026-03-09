'use server'
import { object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { getSession } from '../users/get.server.user'

const schema = object({
  id: string().min(1),
  idUser: string().min(1),
})

export const deleteTp = createAction(schema, async ({ id, idUser }) => {
  const { user } = await getSession()
  if (!user) throw new Error('No estas logueado')
  if (user.id !== idUser && user.tier !== 2) throw new Error('No tienes permiso para eliminar este tp')

  return db.tp.delete({
    where: {
      id,
    },
  })
})
