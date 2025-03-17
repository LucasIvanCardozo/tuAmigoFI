'use client';
import { DataModuleComment } from '@/app/assets/types';
import { useState } from 'react';
import { AiFillLike } from 'react-icons/ai';

interface Params {
  comment: DataModuleComment;
}

export const Comment = ({ comment }: Params) => {
  const [numberLike, setNumberLike] = useState(comment.reactions.length);
  const [stateLike, setStateLike] = useState(false);
  return (
    <div className="flex items-end">
      <div className="w-full bg-red-500">
        <h4 className="text-sm">{comment.users.name}</h4>
        <p className="text-base">{comment.comment.text}</p>
      </div>
      <div>
        <button
          className="flex"
          aria-label="Dar me gusta"
          title="Me gusta"
          //onClick={() => handleLike(true)}
        >
          <AiFillLike
            className={(stateLike ? 'text-green-500' : '') + ' text-xl'}
          />
          {numberLike}
        </button>
      </div>
    </div>
  );
};
