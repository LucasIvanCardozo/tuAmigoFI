'use client';
import { AiFillLike } from 'react-icons/ai';
import { TbAlertHexagon } from 'react-icons/tb';

export function ReactionButtons({
  state,
  amount,
  pending,
  onLike,
  onDislike,
  countClassName,
}: {
  state: boolean | null;
  amount: { likes: number; dislikes: number };
  pending: boolean;
  onLike: () => void;
  onDislike: () => void;
  countClassName?: string;
}) {
  return (
    <>
      <button
        type="button"
        className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Dar me gusta"
        title="Me gusta"
        onClick={onLike}
        disabled={pending}
      >
        <AiFillLike className={`${state === true ? 'text-green-500' : ''} text-xl`} />
        <span className={countClassName}>{amount.likes}</span>
      </button>
      <button
        type="button"
        className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Reportar"
        title="Reportar"
        onClick={onDislike}
        disabled={pending}
      >
        <TbAlertHexagon className={`${state === false ? 'text-red-500' : ''} text-xl`} />
        <span className={countClassName}>{amount.dislikes}</span>
      </button>
    </>
  );
}
