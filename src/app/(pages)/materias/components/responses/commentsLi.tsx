'use client';
import { addTpComment } from '@/app/lib/actions/responses/add.tp.comment';
import { Comment } from './comment';
import { DataModuleComment } from '@/app/assets/types';
import { startTransition } from 'react';
import { useRouter } from 'next/navigation';

interface Params {
  comments: DataModuleComment[];
}

export const CommentsLi = ({ comments }: Params) => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await addTpComment({
      response_id: comments[0].comment.id_response,
      text: 'hola',
    });
    if (error) console.log('Error' + error);
    else console.log('Comentario publicado');
    startTransition(() => router.refresh());
  };
  return (
    <div className="mx-2 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.5)]">
      <form
        className="flex p-1 gap-1 bg-blue-300"
        onSubmit={(e) => handleSubmit(e)}
      >
        <input
          className="grow"
          type="text"
          placeholder="Coloca tu comentario..."
        />
        <button type="submit">Publicar</button>
      </form>
      {comments.length > 0 ? (
        <ul className="w-full flex flex-col gap-1 p-1">
          {comments.map((comment) => (
            <Comment key={comment.comment.id} comments={comment} />
          ))}
        </ul>
      ) : (
        <p>No hay comentarios por el momento :D</p>
      )}
    </div>
  );
};
