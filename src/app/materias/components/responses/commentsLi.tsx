'use client';
import { midterms_comments, tps_comments } from '@prisma/client';
import { Comment } from './comment';

interface Params {
  comments: tps_comments[] | midterms_comments[];
}

export const CommentsLi = ({ comments }: Params) => {
  const auxComments: tps_comments[] = [
    {
      id: 1,
      id_response: 1,
      text: 'comentario 1',
      id_user: 1,
      created_at: new Date(),
    },
    {
      id: 2,
      id_response: 1,
      text: 'comentario 2',
      id_user: 1,
      created_at: new Date(),
    },
  ];
  return (
    <div className="hidden">
      <form className="flex p-1 gap-1 bg-blue-300">
        <input
          className="grow"
          type="text"
          placeholder="Coloca tu comentario..."
        />
        <button type="submit">Publicar</button>
      </form>
      <ul className="w-full bg-black flex flex-col gap-1 p-1">
        {auxComments.map((comment: tps_comments) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </ul>
    </div>
  );
};
