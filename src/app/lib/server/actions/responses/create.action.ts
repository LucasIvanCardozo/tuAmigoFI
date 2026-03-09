'use server'
import z, { number, object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { TypeResponse } from '../../db/prisma/prismaClient/enums'
import { getSession } from '../users/get.server.user'

const schema = object({
  idUser: string().min(1),
  idTp: string().min(1).nullable().optional(),
  idMidterm: string().min(1).nullable().optional(),
  number: number().min(1),
  type: z.enum(Object.values(TypeResponse) as [string, ...string[]]),
  text: string().min(1).nullable().optional(),
}).refine((data) => (data.idTp && !data.idMidterm) || (!data.idTp && data.idMidterm), {
  message: 'Debe existir idTp o idMidterm, pero no ambos',
})

export const createResponse = createAction(schema, async ({ idUser, idTp, idMidterm, number, type, text }) => {
  if (idMidterm && idTp) throw new Error('No puedes tener un parcial y un tp')
  const session = await getSession()
  if (!session) throw new Error('No estas logueado')

  const validation = await db.response.findFirst({
    where: {
      idTp,
      idMidterm,
      idUser,
      number,
    },
  })
  if (!validation) {
    return await db.response.create({
      data: {
        idTp,
        number,
        type: type as TypeResponse,
        idUser,
        ...(text && { text: text }),
      },
    })
  } else throw new Error('No puedes tener mas de una respueste a un problema!')
})
