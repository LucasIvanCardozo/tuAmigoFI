'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { sileo } from 'sileo';
import { upsertReaction } from '@/app/lib/server/actions/reactions/upsert.action';
import type { Reaction } from '@/app/lib/server/db/prisma/prismaClient/client';

type ReactionTarget = 'RESPONSE' | 'COMMENT' | 'TP' | 'MIDTERM';

export function useReactions({
  idTarget,
  typeTarget,
  reactions,
  unauthorizedMessage,
}: {
  idTarget: string;
  typeTarget: ReactionTarget;
  reactions: Reaction[];
  unauthorizedMessage: string;
}) {
  const { data: session } = useSession();
  const [state, setState] = useState<boolean | null>(null);
  const [amount, setAmount] = useState({ likes: 0, dislikes: 0 });
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  useEffect(() => {
    const likes = reactions.filter((reaction) => reaction.reaction).length;
    setAmount({ likes, dislikes: reactions.length - likes });
    const mine = reactions.find((reaction) => reaction.idUser === session?.user.id);
    setState(mine ? mine.reaction : null);
  }, [reactions, session]);

  function requireSession() {
    if (session?.user.id) return true;
    sileo.error({ title: unauthorizedMessage });
    return false;
  }

  async function react(value: boolean, intent: 'toggle' | 'set' | 'unset' = 'toggle') {
    if (!requireSession()) return { ok: false, previous: null as boolean | null };
    if (inFlight.current) return { ok: false, previous: state };
    inFlight.current = true;
    setPending(true);
    const previous = state;
    const wasLikes = amount.likes;
    const wasDislikes = amount.dislikes;
    const next =
      intent === 'unset'
        ? previous === false
          ? null
          : previous
        : value === previous
          ? null
          : value;
    setState(next);
    setAmount({
      likes: wasLikes + (next === true ? 1 : 0) - (previous === true ? 1 : 0),
      dislikes: wasDislikes + (next === false ? 1 : 0) - (previous === false ? 1 : 0),
    });
    const { error, data } = await upsertReaction({ idTarget, typeTarget, reaction: value, intent });
    if (error) {
      setState(previous);
      setAmount({ likes: wasLikes, dislikes: wasDislikes });
      sileo.error({ title: error });
    }
    inFlight.current = false;
    setPending(false);
    return { ok: error === null, previous: data ? data.previous : previous };
  }

  return { state, amount, pending, react, requireSession };
}
