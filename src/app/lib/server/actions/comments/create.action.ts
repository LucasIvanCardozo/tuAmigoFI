'use server'
import { z } from 'zod'
import createAction from '../createActions'
import { getServerUser } from '../users/get.server.user'
import db from '../../db/db'

const { object, string } = z
const schema = object({
  idResponse: string().min(1),
  text: string().min(1),
})

export const createComment = createAction(schema, async ({ idResponse, text }) => {
  const { user } = await getServerUser()
  if (!user) throw new Error('No estas logueado')

  return await db.comment.create({
    data: {
      idResponse,
      text,
      idUser: user.id,
    },
  })
})
