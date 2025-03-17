import {
  DataModule,
  DataModuleComment,
  DataModuleProblem,
} from '@/app/assets/types';
import {
  midterms,
  midterms_comments,
  midterms_comments_reactions,
  midterms_reactions,
  midterms_reports,
  midterms_responses,
  tps,
  tps_comments,
  tps_comments_reactions,
  tps_reactions,
  tps_reports,
  tps_responses,
  users,
} from '@prisma/client';

type TypeTpComment = {
  users: users;
  tps_comments_reactions: tps_comments_reactions[];
} & tps_comments;

type TypeMidtermComment = {
  users: users;
  midterms_comments_reactions: midterms_comments_reactions[];
} & midterms_comments;

/**
 * Define el tipo de respuesta para TP, incluyendo comentarios y reacciones.
 */
type TypeTpResponse = {
  tps_comments: TypeTpComment[];
  tps_reactions: tps_reactions[];
  users: users;
} & tps_responses;

/**
 * Define el tipo de respuesta para Midterm, incluyendo comentarios y reacciones.
 */
type TypeMidtermResponse = {
  midterms_comments: TypeMidtermComment[];
  midterms_reactions: midterms_reactions[];
  users: users;
} & midterms_responses;

/**
 * Define el tipo de módulo para TP, que contiene respuestas, reportes y datos del usuario.
 */
type TypeListTp = {
  tps_responses: TypeTpResponse[];
  tps_reports: tps_reports[];
  users: users;
} & tps;

/**
 * Define el tipo de módulo para Midterm, que contiene respuestas, reportes y datos del usuario.
 */
type TypeListMidterm = {
  midterms_responses: TypeMidtermResponse[];
  midterms_reports: midterms_reports[];
  users: users;
} & midterms;

/**
 * Parámetros de entrada para la función makeModules.
 * @property moduleList - Lista de módulos, ya sea de tipo TP o Midterm.
 * @property type - Discriminante que indica el tipo de módulo ('tps' o 'midterms').
 */
interface Params {
  moduleList: TypeListTp[] | TypeListMidterm[];
  type: 'tps' | 'midterms';
}

/**
 * Procesa una lista de módulos (TP o Midterm) y transforma la data en un arreglo de DataModule.
 *
 * Para cada módulo:
 * - Se obtiene la cantidad de reportes (tps_reports o midterms_reports) según el tipo.
 * - Se agrupan las respuestas por número de problema, inicializando el primer grupo con la primera respuesta.
 * - Se recorren las respuestas y, cuando se detecta un cambio en el número de problema, se crea un nuevo grupo.
 * - Cada grupo de respuestas se ordena de forma descendente según el balance entre "likes" y "dislikes".
 *
 * @param Params Objeto que contiene la lista de módulos y el tipo de módulo.
 * @returns Un arreglo de DataModule con la información procesada.
 */
export const makeModules = ({ moduleList, type }: Params): DataModule[] => {
  let modules: DataModule[] = [];
  const isTp = type == 'tps';

  // Itera sobre cada módulo de la lista
  for (const module of moduleList) {
    // Obtiene la cantidad de reportes, diferenciando por tipo
    const countReports = isTp
      ? (module as TypeListTp).tps_reports.length
      : (module as TypeListMidterm).midterms_reports.length;

    // Obtiene las respuestas correspondientes según el tipo de módulo
    const responses = isTp
      ? (module as TypeListTp).tps_responses
      : (module as TypeListMidterm).midterms_responses;

    // Agrupa las respuestas en problemas, cada grupo corresponde a un "número" de problema
    let dataModuleProblems: DataModuleProblem[] = [];
    let numAux: number = responses[0]?.number;
    let i = 0;

    // Inicializa el primer grupo de problema, si existe al menos una respuesta
    if (responses[0])
      dataModuleProblems.push({ number: responses[i].number, responses: [] });

    // Itera sobre las respuestas para agruparlas por el atributo "number"
    for (const response of responses) {
      // Obtiene las reacciones de la respuesta de acuerdo al tipo
      const reactions = isTp
        ? (response as TypeTpResponse).tps_reactions
        : (response as TypeMidtermResponse).midterms_reactions;
      const comments = isTp
        ? (response as TypeTpResponse).tps_comments
        : (response as TypeMidtermResponse).midterms_comments;
      const dataModuleComment: DataModuleComment[] = [];

      for (const comment of comments) {
        dataModuleComment.push({
          comment: comment,
          users: comment.users,
          reactions: isTp
            ? (comment as TypeTpComment).tps_comments_reactions
            : (comment as TypeMidtermComment).midterms_comments_reactions,
        });
      }

      // Si el número del problema cambia, se inicia un nuevo grupo
      if (numAux != response.number) {
        dataModuleProblems.push({ number: response.number, responses: [] });
        numAux = response.number;
        i++;
      }
      // Agrega la respuesta al grupo correspondiente
      dataModuleProblems[i].responses.push({
        response: response,
        user: response.users,
        reactions: reactions,
        comments: dataModuleComment,
      });
    }

    // Ordena cada grupo de respuestas según el balance (likes - dislikes)
    for (const moduleProblem of dataModuleProblems) {
      moduleProblem.responses.sort((a, b) => {
        const likesA = a.reactions.filter((rea) => rea.reaction).length;
        const disLikesA = a.reactions.length - likesA;
        const likesB = b.reactions.filter((rea) => rea.reaction).length;
        const disLikesB = b.reactions.length - likesB;
        // Ordena de mayor a menor balance neto
        return likesB - disLikesB - (likesA - disLikesA);
      });
    }

    // Crea un objeto DataModule con la información procesada del módulo
    modules.push({
      module: module,
      countReports: countReports,
      user: module.users,
      problems: dataModuleProblems,
    });
  }

  return modules;
};
