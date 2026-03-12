'use server'
import { cuid, object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { commentRepository } from '../../db/repository/comment.repository'
import { revalidateTag } from 'next/cache'
import { userUseCases } from '../../usecases/user.usecases'

const schema = object({
  idResponse: cuid(),
  text: string().min(1),
})

export const createComment = createAction(schema, async ({ idResponse, text }) => {
  const session = await userUseCases.getSession()
  if (!session) throw new Error('No estas logueado')

  const lastComments = await commentRepository(db).findLastsByUserId(session.user.id)

  if (lastComments.length >= 5) throw new Error('Has alcanzado el límite de comentarios por hoy')

  const comments = await db.comment.create({
    data: {
      idResponse,
      text,
      idUser: session.user.id,
    },
  })
  revalidateTag('comments', 'max')
  return comments
})
