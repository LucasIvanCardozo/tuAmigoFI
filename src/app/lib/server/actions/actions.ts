'use server'
import db from '../db/db'
import { Correlative, Link, Midterm, Response, Tp, User } from '../db/prisma/prismaClient/client'

export async function createMidterm({ name, date, idCourse, idUser }: Pick<Midterm, 'name' | 'date' | 'idCourse' | 'idUser'>) {
  try {
    const midterm = db.midterm.create({
      data: {
        name: name,
        date: date,
        idCourse,
        idUser,
      },
    })
    return midterm
  } catch (error) {
    throw new Error('No se pudo subir el parcial')
  }
}

export async function createResponseMidterm({ idUser, idMidterm, number, type, text }: Pick<Response, 'idUser' | 'idMidterm' | 'number' | 'type' | 'text'>) {
  try {
    const validation = await db.response.findFirst({
      where: {
        idMidterm,
        idUser,
        number,
      },
    })
    if (!validation) {
      const addResponse = await db.response.create({
        data: {
          idMidterm,
          number,
          type,
          idUser,
          ...(text && { text: text }),
        },
      })
      return addResponse
    } else throw new Error('No puedes tener mas de una respueste a un problema!')
  } catch (error) {
    throw new Error('No se pudo editar el parcial')
  }
}

export async function createResponseTp({ idUser, idTp, number, type, text }: Pick<Response, 'idUser' | 'idTp' | 'number' | 'type' | 'text'>) {
  try {
    const validation = await db.response.findFirst({
      where: {
        idTp,
        idUser,
        number,
      },
    })
    if (!validation) {
      const addResponse = await db.response.create({
        data: {
          idTp,
          number,
          type,
          idUser,
          ...(text && { text: text }),
        },
      })
      return addResponse
    } else throw new Error('No puedes tener mas de una respueste a un problema!')
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('Error en validacioon de usuario')
    }
  }
}

export async function createTp({ name, number, year, idUser, idCourse }: Pick<Tp, 'name' | 'number' | 'year' | 'idUser' | 'idCourse'>) {
  try {
    const tp = await db.tp.create({
      data: {
        name: name,
        ...(number ? { number: number } : { number: 0 }),
        year: year,
        idUser,
        idCourse,
      },
    })
    return tp
  } catch (error) {
    const err = error as Error
    throw new Error('No se pudo subir el TP')
  }
}

export async function deleteTP({ id }: { id: string }) {
  try {
    const deleteTP = await db.tp.delete({
      where: {
        id,
      },
    })

    return deleteTP
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message)
    else throw new Error('No se pudo eliminar el TP')
  }
}

export async function deleteTpResponse({ id }: { id: string }) {
  try {
    const deleteTpResponse = await db.response.delete({
      where: {
        id: id,
      },
    })
    return deleteTpResponse
  } catch (error) {
    throw new Error('No se pudo eliminar la respuesta')
  }
}

export async function deleteMidterm({ id }: { id: string }) {
  try {
    const deleteMidterm = await db.midterm.delete({
      where: {
        id: id,
      },
    })

    return deleteMidterm
  } catch (error) {
    throw new Error('No se pudo eliminar el Parcial')
  }
}

export async function deleteMidtermResponse({ id }: { id: string }) {
  try {
    const deleteMidtermResponse = await db.response.delete({
      where: {
        id: id,
      },
    })

    return deleteMidtermResponse
  } catch (error) {
    throw new Error('No se pudo eliminar la respuesta')
  }
}
export async function createUser({ name, email, image }: Pick<User, 'name' | 'email' | 'image'>) {
  try {
    const user = await db.user.create({
      data: {
        email: email,
        name: name,
        image: image,
        tier: 0,
        banned: false,
      },
    })
    return user
  } catch (error) {
    throw new Error('Error en la creación de usuario')
  }
}

// export async function addReactionTp({ id, id_response, reaction }: { id: number; id_response: number; reaction: boolean }) {
//   try {
//     const reactionSearch = await db.tps_reactions.findFirst({
//       where: {
//         id_response: id_response,
//         id_user: id,
//       },
//     })
//     if (reactionSearch) {
//       if (reaction != reactionSearch.reaction) {
//         const updateReaction = await db.tps_reactions.update({
//           where: {
//             id: reactionSearch.id,
//           },
//           data: {
//             reaction: reaction,
//           },
//         })
//         return updateReaction
//       } else {
//         const deleteReaction = await db.tps_reactions.delete({
//           where: {
//             id: reactionSearch.id,
//           },
//         })
//         return deleteReaction
//       }
//     } else {
//       const createReaction = await db.tps_reactions.create({
//         data: {
//           id_response: id_response,
//           id_user: id,
//           reaction: reaction,
//         },
//       })
//       return createReaction
//     }
//   } catch (error) {
//     throw new Error('Error en modificar la reaccion de usuario')
//   }
// }

// export async function addReactionMidterm({ id, id_response, reaction }: { id: number; id_response: number; reaction: boolean }) {
//   try {
//     const reactionSearch = await db.midterms_reactions.findFirst({
//       where: {
//         id_response: id_response,
//         id_user: id,
//       },
//     })
//     if (reactionSearch) {
//       if (reaction != reactionSearch.reaction) {
//         const updateReaction = await db.midterms_reactions.update({
//           where: {
//             id: reactionSearch.id,
//           },
//           data: {
//             reaction: reaction,
//           },
//         })
//         return updateReaction
//       } else {
//         const deleteReaction = await db.midterms_reactions.delete({
//           where: {
//             id: reactionSearch.id,
//           },
//         })
//         return deleteReaction
//       }
//     } else {
//       const createReaction = await db.midterms_reactions.create({
//         data: {
//           id_response: id_response,
//           id_user: id,
//           reaction: reaction,
//         },
//       })
//       return createReaction
//     }
//   } catch (error) {
//     throw new Error('Error en modificar reaccion de usuario')
//   }
// }

export async function addLink({ idCourse, name, link, official, idUser }: Pick<Link, 'idCourse' | 'name' | 'link' | 'official' | 'idUser'>) {
  try {
    const createLink = await db.link.create({
      data: {
        idCourse,
        name: name,
        link: link,
        official: official,
        idUser,
      },
    })
    return createLink
  } catch (error) {
    throw new Error('Error en la creación del link')
  }
}

export async function deleteLink({ id }: { id: string }) {
  try {
    const deleteLink = await db.link.delete({
      where: {
        id,
      },
    })
    return deleteLink
  } catch (error) {
    throw new Error('Error en eliminacion de link')
  }
}

export async function createCorrelative({ idCourse, idCorrelativeCourse }: Pick<Correlative, 'idCourse' | 'idCorrelativeCourse'>) {
  try {
    const createCorrelative = await db.correlative.create({
      data: {
        idCourse,
        idCorrelativeCourse,
      },
    })
    return createCorrelative
  } catch (error) {
    throw new Error('Error en la creacion de una correlativa')
  }
}

// export async function addReportLink({ id_link, id_user }: { id_link: number; id_user: number }) {
//   try {
//     const createReport = await db.links_reports.create({
//       data: {
//         id_link: id_link,
//         id_user: id_user,
//       },
//     })
//     return createReport
//   } catch (error) {
//     throw new Error('No poders reportar un link mas de una vez')
//   }
// }

// export async function addReportTp({ id_tp, id_user }: { id_tp: number; id_user: number }) {
//   try {
//     const createReport = await db.tps_reports.create({
//       data: {
//         id_module: id_tp,
//         id_user: id_user,
//       },
//     })
//     return createReport
//   } catch (error) {
//     throw new Error('No poders reportar un TP mas de una vez')
//   }
// }

// export async function addReportMidterm({ id_midterm, id_user }: { id_midterm: number; id_user: number }) {
//   try {
//     const createReport = await db.midterms_reports.create({
//       data: {
//         id_module: id_midterm,
//         id_user: id_user,
//       },
//     })
//     return createReport
//   } catch (error) {
//     throw new Error('No poders reportar un parcial mas de una vez')
//   }
// }
