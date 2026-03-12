'use server'
import z, { boolean, cuid, object } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { ReactionTo } from '../../db/prisma/prismaClient/enums'
import { userUseCases } from '../../usecases/user.usecases'
import { revalidateTag } from 'next/cache'

type ReactionToType = (typeof ReactionTo)[keyof typeof ReactionTo]

const schema = object({
  idTarget: cuid(),
  typeTarget: z.enum(Object.values(ReactionTo) as [ReactionToType, ...ReactionToType[]]),
  reaction: boolean(),
})

export const upsertReaction = createAction(schema, async ({ idTarget, typeTarget, reaction }) => {
  const session = await userUseCases.getSession()
  if (!session) throw new Error('No estas logueado')
  const { id: idUser } = session.user

  const existing = await db.reaction.findFirst({
    where: {
      idUser,
      idTarget,
    },
  })

  let reactionAux
  if (!existing) {
    reactionAux = await db.reaction.create({
      data: {
        idUser,
        idTarget,
        reaction,
        typeTarget,
      },
    })
  } else if (existing.reaction === reaction) {
    reactionAux = await db.reaction.delete({
      where: { id: existing.id },
    })
  } else {
    reactionAux = await db.reaction.update({
      where: { id: existing.id },
      data: { reaction },
    })
  }
  revalidateTag('reactions', 'max')
  return reactionAux
})
