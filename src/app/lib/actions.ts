'use server';
import prisma from './db';

export async function createContributor(
  dni: number,
  name: string,
  instagram?: string
) {
  const contributor = await prisma.contributors.create({
    data: {
      dni: dni,
      name: name,
      ...(instagram
        ? {
            instagram: instagram,
          }
        : {}),
    },
  });
  return contributor;
}

export async function createAnonymus() {
  const existingContributor = await prisma.contributors.findUnique({
    where: {
      dni: 0, // Verificamos si el dni ya existe
    },
  });

  if (!existingContributor) {
    // Si no existe, lo creamos
    const contributor = await prisma.contributors.create({
      data: {
        dni: 0,
        name: 'Anonymus',
      },
    });
    return contributor;
  }

  // Si ya existe, retornamos el registro existente
  return existingContributor;
}

export async function AddContributor(idProblem: number, dni: number) {
  const problem = await prisma.problems.update({
    where: {
      id: idProblem,
    },
    data: {
      id_contributors: dni,
      response: false,
    },
  });
  return problem;
}

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
