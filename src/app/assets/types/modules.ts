import {
  midterms,
  midterms_comments,
  midterms_comments_reactions,
  midterms_reactions,
  midterms_responses,
  tps,
  tps_comments,
  tps_comments_reactions,
  tps_reactions,
  tps_responses,
  users,
} from '@prisma/client';

export interface DataModuleComment {
  comment: TypeModuleComments;
  users: users;
  reactions: TypeModuleCommentsReactions[];
}

export interface DataModuleResponse {
  response: TypeModuleResponses;
  user: users;
  reactions: TypeModuleReactions[];
  comments: DataModuleComment[];
}

export interface DataModuleProblem {
  number: number;
  responses: DataModuleResponse[];
}

export interface DataModule {
  module: TypeModule;
  countReports: number;
  problems: DataModuleProblem[];
  user: users;
}

export type TypeModule = tps | midterms;
export type TypeModuleResponses = tps_responses | midterms_responses;
export type TypeModuleReactions = tps_reactions | midterms_reactions;
export type TypeModuleComments = tps_comments | midterms_comments;
export type TypeModuleCommentsReactions =
  | tps_comments_reactions
  | midterms_comments_reactions;
