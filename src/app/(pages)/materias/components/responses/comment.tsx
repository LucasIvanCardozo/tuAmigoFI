'use client';
import { DataModuleComment } from '@/app/assets/types';
import { likeTpComment } from '@/app/lib/actions/responses/like.tp.comment';
import { useState } from 'react';
import { AiFillLike } from 'react-icons/ai';

interface Params {
  comments: DataModuleComment;
}

export const Comment = ({ comments }: Params) => {
  const [numberLike, setNumberLike] = useState(comments.reactions.length);
  const [stateLike, setStateLike] = useState(false);

  const { comment } = comments;

  const handleLike = async () => {
    const { data: like, error } = await likeTpComment({
      comment_id: comment.id,
    });
    if (!error)
      if (like) {
        setNumberLike(numberLike + 1);
        setStateLike(true);
      } else {
        setNumberLike(numberLike - 1);
        setStateLike(false);
      }
    else {
      console.log(error);
    }
  };

  return (
    <div className="flex items-start gap-2 p-1 bg-white rounded-lg shadow-sm">
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-800">
          {comments.users.name}
        </h4>
        <p className="mt-1 text-sm text-gray-700">{comments.comment.text}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
          aria-label="Dar me gusta"
          title="Me gusta"
          onClick={handleLike}
        >
          <AiFillLike
            className={
              (stateLike ? 'text-green-500' : 'text-gray-400') + ' text-xl'
            }
          />
          <span className="text-sm font-medium text-gray-600">
            {numberLike}
          </span>
        </button>
      </div>
    </div>
  );
};
