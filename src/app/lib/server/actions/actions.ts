'use server'
import db from '../db/db'
import { Correlative, Link, User } from '../db/prisma/prismaClient/client'

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
