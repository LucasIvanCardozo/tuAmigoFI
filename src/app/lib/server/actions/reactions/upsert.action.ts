'use server'
import z, { boolean, object, string } from 'zod'
import createAction from '../createActions'
import db from '../../db/db'
import { ReactionTo } from '../../db/prisma/prismaClient/enums'
import { getServerUser } from '../users/get.server.user'

type ReactionToType = (typeof ReactionTo)[keyof typeof ReactionTo]

const schema = object({
  idTarget: string().cuid(),
  typeTarget: z.enum(Object.values(ReactionTo) as [ReactionToType, ...ReactionToType[]]),
  reaction: boolean(),
})

export const upsertReaction = createAction(schema, async ({ idTarget, typeTarget, reaction }) => {
  const { user } = await getServerUser()
  if (!user) throw new Error('No estas logueado')
  const { id: idUser } = user

  const existing = await db.reaction.findFirst({
    where: {
      idUser,
      idTarget,
    },
  })

  if (!existing) {
    await db.reaction.create({
      data: {
        idUser,
        idTarget,
        reaction,
        typeTarget,
      },
    })
  } else if (existing.reaction === reaction) {
    await db.reaction.delete({
      where: { id: existing.id },
    })
  } else {
    await db.reaction.update({
      where: { id: existing.id },
      data: { reaction },
    })
  }
})
