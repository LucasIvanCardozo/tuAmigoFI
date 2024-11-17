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

export async function createMidterm({
  name,
  date,
  idCourse,
  idUser,
}: {
  name: string;
  date: Date;
  idCourse: number;
  idUser: number;
}) {
  try {
    const midterm = prisma.midterms.create({
      data: {
        name: name,
        date: date,
        id_course: idCourse,
        id_user: idUser,
      },
    });
    return midterm;
  } catch (error) {
    console.error('No se pudo subir el parcial');
  }
}

export async function addResponseMidterm({
  idUser,
  idMidterm,
}: {
  idUser: number;
  idMidterm: number;
}) {
  try {
    const addResponse = await prisma.midterms.update({
      where: {
        id: idMidterm,
      },
      data: {
        response: idUser,
      },
    });
  } catch (error) {
    console.error('No se pudo editar el parcial');
  }
}

export async function addResponseTp({
  idUser,
  idTp,
  number,
  type,
  text,
}: {
  idUser: number;
  idTp: number;
  number: number;
  type: number;
  text?: string;
}) {
  try {
    const validation = await prisma.tps_responses.findFirst({
      where: {
        id_tp: idTp,
        id_user: idUser,
        number: number,
      },
    });
    if (!validation) {
      const addResponse = await prisma.tps_responses.create({
        data: {
          id_tp: idTp,
          number: number,
          type: type,
          id_user: idUser,
          ...(text && { text: text }),
        },
      });
      return addResponse;
    } else
      throw new Error('No puedes tener mas de una respueste a un problema!');
  } catch (error) {
    throw error;
  }
}

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
        ...(number ? { number: number } : { number: 0 }),
        year: year,
        id_user: idUser,
        id_course: idCourse,
      },
    });
    return tp;
  } catch (error) {
    console.error('No se pudo subir el TP');
  }
}

export async function deleteTP({ id }: { id: number }) {
  try {
    const deleteTpsResponses = await prisma.tps_responses.deleteMany({
      where: {
        id_tp: id,
      },
    });
    const deleteTpsReactions = await prisma.tps_reactions.deleteMany({
      where: {
        id_problem: id,
      },
    });
    const deleteTP = await prisma.tps.delete({
      where: {
        id: id,
      },
    });
    return deleteTP;
  } catch (error) {
    throw new Error('No se pudo eliminar el TP');
  }
}
export async function deleteTpResponse({ id }: { id: number }) {
  try {
    const deleteTpsReactions = await prisma.tps_reactions.deleteMany({
      where: {
        id_problem: id,
      },
    });
    const deleteTpResponse = await prisma.tps_responses.delete({
      where: {
        id: id,
      },
    });
    return deleteTpResponse;
  } catch (error) {
    throw new Error('No se pudo eliminar el TP');
  }
}

export async function deleteMidterm({ id }: { id: number }) {
  try {
    const deleteReactions = await prisma.midterms_reactions.deleteMany({
      where: {
        id_midterm: id,
      },
    });
    const deleteMidterm = await prisma.midterms.delete({
      where: {
        id: id,
      },
    });
    return deleteMidterm;
  } catch (error) {
    console.error('No se pudo eliminar el TP');
  }
}

export async function deleteMidtermResponse({ id }: { id: number }) {
  try {
    const deleteReactions = await prisma.midterms_reactions.deleteMany({
      where: {
        id_midterm: id,
      },
    });
    const updateMidterm = await prisma.midterms.update({
      where: {
        id: id,
      },
      data: {
        response: null,
      },
    });
    return deleteMidterm;
  } catch (error) {
    console.error('No se pudo eliminar el TP');
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
        tier: 0,
      },
    });
    return contributor;
  }

  // Si ya existe, retornamos el registro existente
  return existingContributor;
}

// export async function AddContributor(idProblem: number, id: number) {
//   const problem = await prisma.problems.update({
//     where: {
//       id: idProblem,
//     },
//     data: {
//       id_user: id,
//       response: false,
//     },
//   });
//   return problem;
// }

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
      tier: 0,
    },
  });
  return user;
}

export async function addReaction({
  id,
  id_response,
  reaction,
}: {
  id: number;
  id_response: number;
  reaction: number;
}) {
  const reactionSearch = await prisma.tps_reactions.findFirst({
    where: {
      id_problem: id_response,
      id_user: id,
    },
  });
  if (reactionSearch) {
    if (reaction != reactionSearch.reaction) {
      const updateReaction = await prisma.tps_reactions.update({
        where: {
          id: reactionSearch.id,
        },
        data: {
          reaction: reaction,
        },
      });
      return updateReaction;
    } else {
      const deleteReaction = await prisma.tps_reactions.delete({
        where: {
          id: reactionSearch.id,
        },
      });
      return deleteReaction;
    }
  } else {
    const createReaction = await prisma.tps_reactions.create({
      data: {
        id_problem: id_response,
        id_user: id,
        reaction: reaction,
      },
    });
    return createReaction;
  }
}

export async function addReactionMidterm({
  id,
  id_midterm,
  reaction,
}: {
  id: number;
  id_midterm: number;
  reaction: number;
}) {
  const reactionSearch = await prisma.midterms_reactions.findFirst({
    where: {
      id_midterm: id_midterm,
      id_user: id,
    },
  });
  if (reactionSearch) {
    if (reaction != reactionSearch.reaction) {
      const updateReaction = await prisma.midterms_reactions.update({
        where: {
          id: reactionSearch.id,
        },
        data: {
          reaction: reaction,
        },
      });
      return updateReaction;
    } else {
      const deleteReaction = await prisma.midterms_reactions.delete({
        where: {
          id: reactionSearch.id,
        },
      });
      return deleteReaction;
    }
  } else {
    const createReaction = await prisma.midterms_reactions.create({
      data: {
        id_midterm: id_midterm,
        id_user: id,
        reaction: reaction,
      },
    });
    return createReaction;
  }
}
