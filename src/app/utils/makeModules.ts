import { Comment, Midterm, Reaction, Response, Tp, User } from '@/app/lib/server/db/prisma/prismaClient/client'
import { DataModule, DataModuleComment, DataModuleProblem } from '@/app/types'

type TypeComment = {
  user: User
  // reactions: Reaction[]
} & Comment

type TypeResponse = {
  comments: TypeComment[]
  // reactions: Reaction[]
  user: User
} & Response

type TypeListTp = {
  responses: TypeResponse[]
  users: User
} & Tp

type TypeListMidterm = {
  responses: TypeResponse[]
  users: User
} & Midterm

type Props =
  | {
      moduleList: TypeListTp[]
      type: 'tps'
    }
  | {
      moduleList: TypeListMidterm[]
      type: 'midterms'
    }

export const makeModules = ({ moduleList, type }: Props): DataModule[] => {
  let modules: DataModule[] = []
  const isTp = type == 'tps'

  // Itera sobre cada módulo de la lista
  for (const module of moduleList) {
    const responses = module.responses

    // Agrupa las respuestas en problemas, cada grupo corresponde a un "número" de problema
    let dataModuleProblems: DataModuleProblem[] = []
    let numAux = responses[0]?.number
    let i = 0

    // Inicializa el primer grupo de problema, si existe al menos una respuesta
    if (responses[0]) dataModuleProblems.push({ number: responses[i].number, responses: [] })

    // Itera sobre las respuestas para agruparlas por el atributo "number"
    for (const response of responses) {
      // Obtiene las reacciones de la respuesta de acuerdo al tipo
      const { comments } = response
      const dataModuleComment: DataModuleComment[] = []

      for (const comment of comments) {
        dataModuleComment.push({
          comment: comment,
          user: comment.user,
        })
      }

      // Si el número del problema cambia, se inicia un nuevo grupo
      if (numAux != response.number) {
        dataModuleProblems.push({ number: response.number, responses: [] })
        numAux = response.number
        i++
      }
      // Agrega la respuesta al grupo correspondiente
      dataModuleProblems[i].responses.push({
        response: response,
        user: response.user,
        comments: dataModuleComment,
      })
    }

    // // Ordena cada grupo de respuestas según el balance (likes - dislikes)
    // for (const moduleProblem of dataModuleProblems) {
    //   moduleProblem.responses.sort((a, b) => {
    //     const likesA = a.reactions.filter((rea) => rea.reaction).length
    //     const disLikesA = a.reactions.length - likesA
    //     const likesB = b.reactions.filter((rea) => rea.reaction).length
    //     const disLikesB = b.reactions.length - likesB
    //     // Ordena de mayor a menor balance neto
    //     return likesB - disLikesB - (likesA - disLikesA)
    //   })
    // }

    // Crea un objeto DataModule con la información procesada del módulo
    modules.push({
      module: module,
      user: module.users,
      problems: dataModuleProblems,
    })
  }

  return modules
}
