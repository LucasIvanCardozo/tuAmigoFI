import { Comment, Midterm, Reaction, Response, Tp, User } from '../lib/server/db/prisma/prismaClient/client'

export interface DataModuleComment {
  comment: Comment
  user: User
  // reactions: Reaction[]
}

export interface DataModuleResponse {
  response: Response
  user: User
  // reactions: Reaction[]
  comments: DataModuleComment[]
}

export interface DataModuleProblem {
  number: number
  responses: DataModuleResponse[]
}

export interface DataModule {
  module: Tp | Midterm
  problems: DataModuleProblem[]
  user: User
}
