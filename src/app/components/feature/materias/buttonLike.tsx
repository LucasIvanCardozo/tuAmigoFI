'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { sileo } from 'sileo';
import { upsertReaction } from '@/app/lib/server/actions/reactions/upsert.action';
import type { Reaction } from '@/app/lib/server/db/prisma/prismaClient/client';

export default function ButtonLike({
  idTarget,
  typeTarget,
  reactions,
}: {
  idTarget: string;
  typeTarget: 'TP' | 'MIDTERM';
  reactions: Reaction[];
}) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  useEffect(() => {
    setLikes(reactions.filter((reaction) => reaction.reaction).length);
    setLiked(
      reactions.some((reaction) => reaction.reaction && reaction.idUser === session?.user.id),
    );
  }, [reactions, session]);

  async function handleLike() {
    if (!session?.user.id) {
      sileo.error({
        title: 'Debes iniciar sesion para dar me gusta.',
      });
      return;
    }
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    const wasLiked = liked;
    const wasLikes = likes;
    setLiked(!wasLiked);
    setLikes(wasLiked ? wasLikes - 1 : wasLikes + 1);
    const { error } = await upsertReaction({ idTarget, typeTarget, reaction: true });
    if (error) {
      setLiked(wasLiked);
      setLikes(wasLikes);
      sileo.error({ title: error });
    }
    inFlight.current = false;
    setPending(false);
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
      <AiFillLike className={`${liked ? 'text-green-500' : ''} text-xl`} />
      <span className="text-xs tabular-nums">{likes}</span>
    </button>
  );
}
