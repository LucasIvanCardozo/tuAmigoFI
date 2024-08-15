'use server';
import prisma from './db';

export async function createUser(uuid: string) {
  const user = await prisma.users.create({
    data: {
      id: uuid,
    },
  });
  return user;
}

export async function addReaction({
  uuid,
  id_problem,
  reaction,
}: {
  uuid: string;
  id_problem: number;
  reaction: number;
}) {
  const reactionSearch = await prisma.user_reactions.findFirst({
    where: {
      id_problem: id_problem,
      id_user: uuid,
    },
  });
  if (reactionSearch) {
    if (reaction != reactionSearch.reaction) {
      const updateReaction = await prisma.user_reactions.update({
        where: {
          id: reactionSearch.id,
        },
        data: {
          reaction: reaction,
        },
      });
      return updateReaction;
    } else {
      const deleteReaction = await prisma.user_reactions.delete({
        where: {
          id: reactionSearch.id,
        },
      });
      return deleteReaction;
    }
  } else {
    const createReaction = await prisma.user_reactions.create({
      data: {
        id_problem: id_problem,
        id_user: uuid,
        reaction: reaction,
      },
    });
    return createReaction;
  }
}
