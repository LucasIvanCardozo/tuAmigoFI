import type {
  Comment,
  Midterm,
  Reaction,
  Response,
  Tp,
  User,
} from '@/app/lib/server/db/prisma/prismaClient/client';
import type {
  DataModule,
  DataModuleComment,
  DataModuleProblem,
  DataModuleResponse,
} from '@/app/types';

type TypeComment = {
  user: User;
} & Comment;

type TypeResponse = {
  comments: TypeComment[];
  user: User;
} & Response;

type TypeListTp = {
  responses: TypeResponse[];
  users: User;
} & Tp;

type TypeListMidterm = {
  responses: TypeResponse[];
  users: User;
} & Midterm;

type Props = {
  moduleList: TypeListTp[] | TypeListMidterm[];
  type: 'tp' | 'midterm';
  reactions: {
    midtermReactions: Reaction[];
    responseReactions: Reaction[];
    commentReactions: Reaction[];
    tpReactions: Reaction[];
    linkReactions: Reaction[];
  };
};

const buildDataModuleResponse = (
  response: TypeResponse,
  commentReactions: Reaction[],
  responseReactions: Reaction[],
): DataModuleResponse => {
  const dataModuleComment: DataModuleComment[] = [];

  for (const comment of response.comments) {
    dataModuleComment.push({
      comment: comment,
      user: comment.user,
      reactions: commentReactions.filter((reaction) => reaction.idTarget === comment.id),
    });
  }

  return {
    response: response,
    user: response.user,
    comments: dataModuleComment,
    reactions: responseReactions.filter((reaction) => reaction.idTarget === response.id),
  };
};

const sortByBalance = (responses: DataModuleResponse[]) => {
  responses.sort((a, b) => {
    const likesA = a.reactions.filter((rea) => rea.reaction).length;
    const disLikesA = a.reactions.length - likesA;
    const likesB = b.reactions.filter((rea) => rea.reaction).length;
    const disLikesB = b.reactions.length - likesB;
    return likesB - disLikesB - (likesA - disLikesA);
  });
};

export const makeModules = ({ moduleList, reactions, type }: Props): DataModule[] => {
  const modules: DataModule[] = [];
  const isTp = type === 'tp';

  // Itera sobre cada módulo de la lista
  for (const module of moduleList) {
    const responses = module.responses;

    const fullResponses = responses
      .filter((response) => response.allProblems)
      .map((response) =>
        buildDataModuleResponse(response, reactions.commentReactions, reactions.responseReactions),
      );
    sortByBalance(fullResponses);

    const individualResponses = responses.filter((response) => !response.allProblems);

    // Agrupa las respuestas en problemas, cada grupo corresponde a un "número" de problema
    const dataModuleProblems: DataModuleProblem[] = [];
    let numAux = individualResponses[0]?.number;
    let i = 0;

    // Inicializa el primer grupo de problema, si existe al menos una respuesta
    if (individualResponses[0])
      dataModuleProblems.push({ number: individualResponses[i].number, responses: [] });

    // Itera sobre las respuestas para agruparlas por el atributo "number"
    for (const response of individualResponses) {
      // Si el número del problema cambia, se inicia un nuevo grupo
      if (numAux !== response.number) {
        dataModuleProblems.push({ number: response.number, responses: [] });
        numAux = response.number;
        i++;
      }
      // Agrega la respuesta al grupo correspondiente
      dataModuleProblems[i].responses.push(
        buildDataModuleResponse(response, reactions.commentReactions, reactions.responseReactions),
      );
    }

    // // Ordena cada grupo de respuestas según el balance (likes - dislikes)
    for (const moduleProblem of dataModuleProblems) {
      sortByBalance(moduleProblem.responses);
    }

    // Crea un objeto DataModule con la información procesada del módulo
    modules.push({
      module: module,
      user: module.users,
      problems: dataModuleProblems,
      fullResponses: fullResponses,
      reactions: (isTp ? reactions.tpReactions : reactions.midtermReactions).filter(
        (reaction) => reaction.idTarget === module.id,
      ),
    });
  }

  return modules;
};
