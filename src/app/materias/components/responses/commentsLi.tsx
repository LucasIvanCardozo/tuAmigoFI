'use client';
import { Comment } from './comment';
import { DataModuleComment } from '@/app/assets/types';

interface Params {
  comments: DataModuleComment[];
}

export const CommentsLi = ({ comments }: Params) => {
  return (
    <div className="mx-2 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.5)]">
      <form className="flex p-1 gap-1 bg-blue-300">
        <input
          className="grow"
          type="text"
          placeholder="Coloca tu comentario..."
        />
        <button type="submit">Publicar</button>
      </form>
      {comments.length > 0 && (
        <ul className="w-full flex flex-col gap-1 p-1">
          {comments.map((comment) => (
            <Comment key={comment.comment.id} comment={comment} />
          ))}
        </ul>
      )}
    </div>
  );
};
