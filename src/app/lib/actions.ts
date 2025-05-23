'use server';
import Link from 'next/link';
import prisma from './db';

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
    throw new Error('No se pudo subir el parcial');
  }
}

export async function createResponseMidterm({
  idUser,
  idMidterm,
  number,
  type,
  text,
}: {
  idUser: number;
  idMidterm: number;
  number: number;
  type: number;
  text?: string;
}) {
  try {
    const validation = await prisma.midterms_responses.findFirst({
      where: {
        id_module: idMidterm,
        id_user: idUser,
        number: number,
      },
    });
    if (!validation) {
      const addResponse = await prisma.midterms_responses.create({
        data: {
          id_module: idMidterm,
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
    throw new Error('No se pudo editar el parcial');
  }
}

export async function createResponseTp({
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
        id_module: idTp,
        id_user: idUser,
        number: number,
      },
    });
    if (!validation) {
      const addResponse = await prisma.tps_responses.create({
        data: {
          id_module: idTp,
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
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error en validacioon de usuario');
    }
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
    throw new Error('No se pudo subir el TP');
  }
}

export async function deleteTP({ id }: { id: number }) {
  try {
    const deleteTP = await prisma.tps.delete({
      where: {
        id: id,
      },
    });

    return deleteTP;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error('No se pudo eliminar el TP');
  }
}

export async function deleteTpResponse({ id }: { id: number }) {
  try {
    const deleteTpResponse = await prisma.tps_responses.delete({
      where: {
        id: id,
      },
    });
    return deleteTpResponse;
  } catch (error) {
    throw new Error('No se pudo eliminar la respuesta');
  }
}

export async function deleteMidterm({ id }: { id: number }) {
  try {
    const deleteMidterm = await prisma.midterms.delete({
      where: {
        id: id,
      },
    });

    return deleteMidterm;
  } catch (error) {
    throw new Error('No se pudo eliminar el Parcial');
  }
}

export async function deleteMidtermResponse({ id }: { id: number }) {
  try {
    const deleteMidtermResponse = await prisma.midterms_responses.delete({
      where: {
        id: id,
      },
    });

    return deleteMidtermResponse;
  } catch (error) {
    throw new Error('No se pudo eliminar la respuesta');
  }
}
export async function createUser({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image: string;
}) {
  try {
    const user = await prisma.users.create({
      data: {
        email: email,
        name: name,
        image: image,
        tier: 0,
        banned: false,
      },
    });
    return user;
  } catch (error) {
    throw new Error('Error en la creación de usuario');
  }
}

export async function addReactionTp({
  id,
  id_response,
  reaction,
}: {
  id: number;
  id_response: number;
  reaction: boolean;
}) {
  try {
    const reactionSearch = await prisma.tps_reactions.findFirst({
      where: {
        id_response: id_response,
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
          id_response: id_response,
          id_user: id,
          reaction: reaction,
        },
      });
      return createReaction;
    }
  } catch (error) {
    throw new Error('Error en modificar la reaccion de usuario');
  }
}

export async function addReactionMidterm({
  id,
  id_response,
  reaction,
}: {
  id: number;
  id_response: number;
  reaction: boolean;
}) {
  try {
    const reactionSearch = await prisma.midterms_reactions.findFirst({
      where: {
        id_response: id_response,
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
          id_response: id_response,
          id_user: id,
          reaction: reaction,
        },
      });
      return createReaction;
    }
  } catch (error) {
    throw new Error('Error en modificar reaccion de usuario');
  }
}

export async function addLink({
  idCourse,
  name,
  link,
  official,
  idUser,
}: {
  idCourse: number;
  name: string;
  link: string;
  official: boolean;
  idUser: number;
}) {
  try {
    const createLink = await prisma.links.create({
      data: {
        id_course: idCourse,
        name: name,
        link: link,
        official: official,
        id_user: idUser,
      },
    });
    return createLink;
  } catch (error) {
    throw new Error('Error en la creación del link');
  }
}

export async function deleteLink({ id_link }: { id_link: number }) {
  try {
    const deleteLink = await prisma.links.delete({
      where: {
        id: id_link,
      },
    });
    return deleteLink;
  } catch (error) {
    throw new Error('Error en eliminacion de link');
  }
}

export async function createCorrelative({
  id,
  id_correlative,
}: {
  id: number;
  id_correlative: number;
}) {
  try {
    const createCorrelative = await prisma.correlatives.create({
      data: {
        id: id,
        id_correlative: id_correlative,
      },
    });
    return createCorrelative;
  } catch (error) {
    throw new Error('Error en la creacion de una correlativa');
  }
}

export async function addReportLink({
  id_link,
  id_user,
}: {
  id_link: number;
  id_user: number;
}) {
  try {
    const createReport = await prisma.links_reports.create({
      data: {
        id_link: id_link,
        id_user: id_user,
      },
    });
    return createReport;
  } catch (error) {
    throw new Error('No poders reportar un link mas de una vez');
  }
}

export async function addReportTp({
  id_tp,
  id_user,
}: {
  id_tp: number;
  id_user: number;
}) {
  try {
    const createReport = await prisma.tps_reports.create({
      data: {
        id_module: id_tp,
        id_user: id_user,
      },
    });
    return createReport;
  } catch (error) {
    throw new Error('No poders reportar un TP mas de una vez');
  }
}

export async function addReportMidterm({
  id_midterm,
  id_user,
}: {
  id_midterm: number;
  id_user: number;
}) {
  try {
    const createReport = await prisma.midterms_reports.create({
      data: {
        id_module: id_midterm,
        id_user: id_user,
      },
    });
    return createReport;
  } catch (error) {
    throw new Error('No poders reportar un parcial mas de una vez');
  }
}
