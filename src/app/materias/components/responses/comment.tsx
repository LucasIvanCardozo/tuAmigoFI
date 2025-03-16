'use client';
import { midterms_comments, tps_comments } from '@prisma/client';

interface Params {
  comment: tps_comments | midterms_comments;
}

export const Comment = ({ comment }: Params) => {
  return <div className="h-10 w-full bg-red-500"></div>;
};
