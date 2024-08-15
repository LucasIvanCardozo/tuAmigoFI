'use server';
import prisma from './db';

export async function addReaction({
  ip,
  id_problem,
  reaction,
}: {
  ip: string;
  id_problem: number;
  reaction: number;
}) {
  const ipSearch = await prisma.users.findFirst({
    where: {
      ip: ip,
    },
  });
  if (ipSearch) {
    const reactionSearch = await prisma.user_reactions.findFirst({
      where: {
        id_problem: id_problem,
        id_user: ipSearch.id,
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
        const updateReaction = await prisma.user_reactions.delete({
          where: {
            id: reactionSearch.id,
          },
        });
        return updateReaction;
      }
    } else {
      const createReaction = await prisma.user_reactions.create({
        data: {
          id_problem: id_problem,
          id_user: ipSearch.id,
          reaction: reaction,
        },
      });
      return createReaction;
    }
  } else {
    const createUser = await prisma.users.create({
      data: {
        ip: ip,
      },
    });
    const createReaction = await prisma.user_reactions.create({
      data: {
        id_problem: id_problem,
        id_user: createUser.id,
        reaction: reaction,
      },
    });
    return createReaction;
  }
}
