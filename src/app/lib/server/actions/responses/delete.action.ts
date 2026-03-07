'use server'
import { boolean, number, object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { getServerUser } from '../users/get.server.user'

const schema = object({
  id: string().min(1),
  idUser: string().min(1),
  type: string().min(1),
  idTp: boolean().nullable().optional(),
  idMidterm: boolean().nullable().optional(),
  number: number().min(1),
}).refine((data) => (data.idTp && !data.idMidterm) || (!data.idTp && data.idMidterm), {
  message: 'Debe existir idTp o idMidterm, pero no ambos',
})

export const deleteResponse = createAction(schema, async ({ id, idUser, type, idTp, idMidterm, number }) => {
  const { user } = await getServerUser()
  if (!user) throw new Error('No estas logueado')
  else if (user.id !== idUser && user.tier !== 2) throw new Error('No tienes permiso para eliminar esta respuesta')
  const isTp = !!idTp

  if (type == 'IMAGE' || type == 'PDF') {
    const formData = new FormData()
    formData.set('id', idUser)
    formData.set('subFolder', `${isTp ? 'tps' : 'parciales'}/respuestas/${isTp ? idTp : idMidterm}/${number}`)
    const res = await fetch('/api/destroy', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('Error al eliminar respuesta')
  }

  return db.response.delete({
    where: {
      id: id,
    },
  })
})
