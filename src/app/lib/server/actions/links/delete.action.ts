'use server'
import { object, string } from 'zod'
import db from '../../db/db'
import createAction from '../createActions'
import { getSession } from '../users/get.server.user'

const schema = object({
  id: string().min(1),
  idUser: string().min(1),
})

export const deleteLink = createAction(schema, async ({ id, idUser }) => {
  const session = await getSession()
  if (!session) throw new Error('No estas logueado')
  if (session.user.id !== idUser && session.user.tier !== 2) throw new Error('No tienes permiso para eliminar este tp')

  return db.link.delete({
    where: {
      id,
    },
  })
})
