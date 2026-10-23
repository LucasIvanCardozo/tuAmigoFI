import type { Reaction } from '@/app/lib/server/db/prisma/prismaClient/client';
import type { DataModule } from '@/app/types';

export const REPORTS_TO_HIDE = 3;

export const countReports = (reactions: Reaction[]) =>
  reactions.filter((reaction) => reaction.reaction === false).length;

export const visibleModules = (modules: DataModule[], canModerate: boolean) =>
  canModerate
    ? modules
    : modules.filter((module) => countReports(module.reactions) < REPORTS_TO_HIDE);
