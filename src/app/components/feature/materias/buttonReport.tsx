'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { TbAlertHexagon } from 'react-icons/tb';
import { sileo } from 'sileo';
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
  const [reported, setReported] = useState(false);

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
    setReported(!reported);
    const { error } = await upsertReaction({ idTarget, typeTarget, reaction: false });
    if (error) {
      setReported(reported);
      sileo.error({ title: error });
    }
  }

  const isModerator = session?.user.tier === 2;
  const reports = reactions.filter((reaction) => reaction.reaction === false).length;

  return (
    <button
      type="button"
      className="flex items-center"
      aria-label="Reportar"
      title="Reportar"
      onClick={handleReport}
    >
      <TbAlertHexagon className={`${reported ? 'text-red-500' : ''} text-xl`} />
      {isModerator && <span className="text-xs tabular-nums">{reports}</span>}
    </button>
  );
}
