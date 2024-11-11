'use server';
import prisma from './db';

// export async function createContributor(
//   dni: number,
//   name: string,
//   instagram?: string
// ) {
//   const contributor = await prisma.contributors.create({
//     data: {
//       dni: dni,
//       name: name,
//       ...(instagram
//         ? {
//             instagram: instagram,
//           }
//         : {}),
//     },
//   });
//   return contributor;
// }

export async function createTp({
  name,
  number,
  year,
  idUser,
  idCourse,
}: {
  name: string;
  number?: number | null;
  year: number;
  idUser: number;
  idCourse: number;
}) {
  try {
    const tp = await prisma.tps.create({
      data: {
        name: name,
        ...(number ? { number: number } : {}),
        year: year,
        id_user: idUser,
      },
    });
    const tps_courses = await prisma.tps_courses.create({
      data: {
        courses_id: idCourse,
        tps_id: tp.id,
      },
    });
    return tp;
  } catch (error) {
    console.error('No se pudo subir el tp');
  }
}

export async function createAnonymus() {
  const existingContributor = await prisma.users.findUnique({
    where: {
      id: 0, // Verificamos si el dni ya existe
    },
  });

  if (!existingContributor) {
    // Si no existe, lo creamos
    const contributor = await prisma.users.create({
      data: {
        id: 0,
        email: 'Anonymous',
        name: 'Anonymous',
        admin: false,
      },
    });
    return contributor;
  }

  // Si ya existe, retornamos el registro existente
  return existingContributor;
}

export async function AddContributor(idProblem: number, id: number) {
  const problem = await prisma.problems.update({
    where: {
      id: idProblem,
    },
    data: {
      id_user: id,
      response: false,
    },
  });
  return problem;
}

export async function createUser({
  name,
  email,
  image,
}: {
  name?: string | null;
  email: string;
  image?: string | null;
}) {
  const user = await prisma.users.create({
    data: {
      email: email,
      ...(name ? { name: name } : {}),
      ...(image ? { image: image } : {}),
      admin: false,
    },
  });
  return user;
}

export async function addReaction({
  id,
  id_problem,
  reaction,
}: {
  id: number;
  id_problem: number;
  reaction: number;
}) {
  const userId = await prisma.users.findFirstOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
    },
  });
  const reactionSearch = await prisma.user_reactions.findFirst({
    where: {
      id_problem: id_problem,
      id_user: userId.id,
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
        id_user: userId.id,
        reaction: reaction,
      },
    });
    return createReaction;
  }
}
