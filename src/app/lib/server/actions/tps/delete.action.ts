'use server'
import { object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { getServerUser } from '../users/get.server.user'

const schema = object({
  id: string().min(1),
  idUser: string().min(1),
})

export const deleteTp = createAction(schema, async ({ id, idUser }) => {
  const { user } = await getServerUser()
  if (!user) throw new Error('No estas logueado')
  if (user.id !== idUser && user.tier !== 2) throw new Error('No tienes permiso para eliminar este tp')

  const formData = new FormData()
  formData.set('id', id)
  formData.set('subFolder', `tps/respuestas/${id}`)
  const res = await fetch('/api/destroyAll', {
    method: 'POST',
    body: formData,
  })

  formData.set('id', id)
  formData.set('subFolder', `tps/problemas`)
  const res2 = await fetch('/api/destroy', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok || !res2.ok) throw new Error('Error al eliminar el tp')
  return db.tp.delete({
    where: {
      id,
    },
  })
})
