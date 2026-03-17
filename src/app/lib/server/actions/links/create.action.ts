'use server'
import { boolean, cuid, object, string, url } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { userUseCases } from '../../usecases/user.usecases'
import { revalidateTag } from 'next/cache'

const schema = object({
  idCourse: cuid(),
  name: string().min(1),
  link: url().refine((url) => {
    const parsed = new URL(url)
    return ['https:'].includes(parsed.protocol)
  }, 'Solo URLs HTTPS permitidas'),
  official: boolean(),
})

export const createLink = createAction(schema, async ({ idCourse, name, link, official }) => {
  const session = await userUseCases.getSession()
  if (!session) throw new Error('No estas logueado')

  const newLink = await db.link.create({
    data: {
      idCourse,
      name: name,
      link: link,
      official: official,
      idUser: session.user.id,
    },
  })

  revalidateTag('links', 'max')
  return newLink
})
