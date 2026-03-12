'use server'
import z, { cuid, number, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { TypeResponse } from '../../db/prisma/prismaClient/enums'
import { userUseCases } from '../../usecases/user.usecases'
import { revalidateTag } from 'next/cache'

const schema = z
  .object({
    idUser: cuid(),
    idTp: cuid().nullable().optional(),
    idMidterm: cuid().nullable().optional(),
    number: number().min(1),
    type: z.enum(Object.values(TypeResponse) as [string, ...string[]]),
    text: string().min(1).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const hasTp = Boolean(data.idTp)
    const hasMid = Boolean(data.idMidterm)

    if (hasTp === hasMid) {
      ctx.addIssue({
        code: 'custom',
        message: 'Debe existir idTp o idMidterm, pero no ambos',
      })
    }
  })

export const createResponse = createAction(schema, async ({ idUser, idTp, idMidterm, number, type, text }) => {
  if (idMidterm && idTp) throw new Error('No puedes tener un parcial y un tp')
  const session = await userUseCases.getSession()
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
    const response = await db.response.create({
      data: {
        idTp,
        number,
        type: type as TypeResponse,
        idUser,
        ...(text && { text: text }),
      },
    })
    revalidateTag('responses', 'max')
    return response
  } else throw new Error('No puedes tener mas de una respueste a un problema!')
})
