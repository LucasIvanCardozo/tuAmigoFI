'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { TbAlertHexagon } from 'react-icons/tb';
import { sileo } from 'sileo';
import { useReload } from '@/app/hooks/useReload';
import { upsertReaction } from '@/app/lib/server/actions/reactions/upsert.action';
import type { Reaction } from '@/app/lib/server/db/prisma/prismaClient/client';

export default function ButtonReport({
  idTarget,
  typeTarget,
  reactions,
}: {
  idTarget: string;
  typeTarget: 'TP' | 'MIDTERM';
  reactions: Reaction[];
}) {
  const { data: session } = useSession();
  const { startReload } = useReload();
  const [reported, setReported] = useState(false);
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  useEffect(() => {
    setReported(
      reactions.some(
        (reaction) => reaction.idUser === session?.user.id && reaction.reaction === false,
      ),
    );
  }, [reactions, session]);

  async function handleReport() {
    if (!session?.user.id) {
      sileo.error({
        title: 'Debes iniciar sesion para reportar.',
      });
      return;
    }
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setReported(!reported);
    const { error } = await upsertReaction({ idTarget, typeTarget, reaction: false });
    if (error) {
      setReported(reported);
      sileo.error({ title: error });
    }
    startReload();
    inFlight.current = false;
    setPending(false);
  }

  const isModerator = session?.user.tier === 2;
  const reports = reactions.filter((reaction) => reaction.reaction === false).length;

  return (
    <button
      type="button"
      className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Reportar"
      title="Reportar"
      onClick={handleReport}
      disabled={pending}
    >
      <TbAlertHexagon className={`${reported ? 'text-red-500' : ''} text-xl`} />
      {isModerator && <span className="text-xs tabular-nums">{reports}</span>}
    </button>
  );
}
