'use server'

import { cuid, file, object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { userUseCases } from '../../usecases/user.usecases'
import { revalidateTag } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const schema = object({
  name: string().min(1),
  date: string().min(1),
  idCourse: cuid(),
  idUser: cuid(),
  file: file()
    .refine((file) => file.size < 5_000_000, 'Max 5MB')
    .refine((file) => file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png', 'Solo PDF, JPEG o PNG'),
})

export const createMidterm = createAction(schema, async ({ name, date, idCourse, idUser, file }) => {
  const session = await userUseCases.getSession()
  if (!session) throw new Error('No estas logueado')

  const midterm = await db.midterm.create({
    data: {
      name: name,
      date: date,
      idCourse,
      idUser,
    },
  })

  const id = midterm.id
  const type = file.type.split('/').reverse()[0]
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const subFolder = `parciales/problemas`
  if (type == 'pdf')
    await cloudinary.uploader.unsigned_upload(`data:application/${type};base64,${buffer.toString('base64')}`, 'ml_default', {
      public_id: id,
      folder: subFolder,
    })
  else
    await cloudinary.uploader.unsigned_upload(`data:image/${type};base64,${buffer.toString('base64')}`, 'ml_default', {
      public_id: id,
      folder: subFolder,
    })

  revalidateTag(`midterms`, 'max')
  return midterm
})
