import {
  midterms,
  midterms_reactions,
  midterms_responses,
  tps,
  tps_reactions,
  tps_responses,
  users,
} from '@prisma/client';

export interface DataModuleResponse {
  response: TypeModuleResponses;
  user: users;
  reactions: TypeModuleReactions[];
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
