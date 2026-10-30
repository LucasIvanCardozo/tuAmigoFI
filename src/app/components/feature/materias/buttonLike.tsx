'use client';
import { AiFillLike } from 'react-icons/ai';
import { sileo } from 'sileo';
import type { Reaction } from '@/app/lib/server/db/prisma/prismaClient/client';
import { useReactions } from './useReactions';

export default function ButtonLike({
  idTarget,
  typeTarget,
  reactions,
}: {
  idTarget: string;
  typeTarget: 'TP' | 'MIDTERM';
  reactions: Reaction[];
}) {
  const { state, amount, pending, react } = useReactions({
    idTarget,
    typeTarget,
    reactions,
    unauthorizedMessage: 'Debes iniciar sesion para dar me gusta.',
  });

  async function handleLike() {
    const { ok, previous } = await react(true, state === true ? 'unset' : 'set');
    if (ok && previous === false) {
      sileo.warning({
        title: 'Tu like reemplazó el reporte que hiciste de este archivo.',
      });
    }
  }

  return (
    <button
      type="button"
      className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Dar me gusta"
      title="Me gusta"
      onClick={handleLike}
      disabled={pending}
    >
      <AiFillLike className={`${state === true ? 'text-green-500' : ''} text-xl`} />
      <span className="text-xs tabular-nums">{amount.likes}</span>
    </button>
  );
}
