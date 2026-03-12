'use server'
process.loadEnvFile()
import z, { cuid, file, number, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { TypeResponse } from '../../db/prisma/prismaClient/enums'
import { userUseCases } from '../../usecases/user.usecases'
import { revalidateTag } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const schema = z
  .object({
    idUser: cuid(),
    idTp: cuid().nullable().optional(),
    idMidterm: cuid().nullable().optional(),
    number: number().min(1),
    type: z.enum(Object.values(TypeResponse) as [string, ...string[]]),
    text: string().min(1).nullable().optional(),
    file: file()
      .refine((file) => file.size < 5_000_000, 'Max 5MB')
      .refine((file) => file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png', 'Solo PDF, JPEG o PNG')
      .nullable()
      .optional(),
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

export const createResponse = createAction(schema, async ({ idUser, idTp, idMidterm, number, type, text, file }) => {
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

    if ((type == 'IMAGE' || type == 'PDF') && file) {
      const id = response.id
      const type = file.type.split('/').reverse()[0]
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const subFolder = `${idTp ? 'tps' : 'parciales'}/respuestas/${idTp || idMidterm}/${number}`
      if (type == 'pdf')
        await cloudinary.uploader.unsigned_upload(`data:application/${type};base64,${buffer.toString('base64')}`, 'ml_default', {
          public_id: session.user.id,
          folder: subFolder,
        })
      else
        await cloudinary.uploader.unsigned_upload(`data:image/${type};base64,${buffer.toString('base64')}`, 'ml_default', {
          public_id: session.user.id,
          folder: subFolder,
        })
    }

    revalidateTag('responses', 'max')
    return response
  } else throw new Error('No puedes tener mas de una respueste a un problema!')
})
