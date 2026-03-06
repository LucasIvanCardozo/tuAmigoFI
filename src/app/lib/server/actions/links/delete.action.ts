'use server'
import { object, string } from 'zod'
import db from '../../db/db'
import createAction from '../createActions'
import { getServerUser } from '../users/get.server.user'

const schema = object({
  id: string().min(1),
  idUser: string().min(1),
})

export const deleteLink = createAction(schema, async ({ id, idUser }) => {
  const { user } = await getServerUser()
  if (!user) throw new Error('No estas logueado')
  if (user.id !== idUser && user.tier !== 2) throw new Error('No tienes permiso para eliminar este tp')

  return db.link.delete({
    where: {
      id,
    },
  })
})
