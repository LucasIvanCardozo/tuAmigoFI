'use server'
import { z } from 'zod'
import createAction from '../createActions'
import { getServerUser } from '../users/get.server.user'
import db from '../../db/db'
import { commentRepository } from '../../db/repository/comment.repository'

const { object, string } = z
const schema = object({
  idResponse: string().min(1),
  text: string().min(1),
})

export const createComment = createAction(schema, async ({ idResponse, text }) => {
  const { user } = await getServerUser()
  if (!user) throw new Error('No estas logueado')

  const lastComments = await commentRepository(db).findLastsByUserId(user.id)

  if (lastComments.length >= 5) throw new Error('Has alcanzado el límite de comentarios por hoy')

  return await db.comment.create({
    data: {
      idResponse,
      text,
      idUser: user.id,
    },
  })
})
