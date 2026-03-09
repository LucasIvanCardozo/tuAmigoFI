'use server'
import { boolean, object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { getSession } from '../users/get.server.user'

const schema = object({
  idCourse: string().min(1),
  name: string().min(1),
  link: string().min(1),
  official: boolean(),
})

export const createLink = createAction(schema, async ({ idCourse, name, link, official }) => {
  const session = await getSession()
  if (!session) throw new Error('No estas logueado')

  return db.link.create({
    data: {
      idCourse,
      name: name,
      link: link,
      official: official,
      idUser: session.user.id,
    },
  })
})
