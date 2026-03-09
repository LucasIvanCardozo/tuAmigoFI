'use server'
import { object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { getSession } from '../users/get.server.user'

const schema = object({
  id: string().min(1),
  idUser: string().min(1),
})

export const deleteResponse = createAction(schema, async ({ id, idUser }) => {
  const { user } = await getSession()
  if (!user) throw new Error('No estas logueado')
  else if (user.id !== idUser && user.tier !== 2) throw new Error('No tienes permiso para eliminar esta respuesta')

  return db.response.delete({
    where: {
      id: id,
    },
  })
})
