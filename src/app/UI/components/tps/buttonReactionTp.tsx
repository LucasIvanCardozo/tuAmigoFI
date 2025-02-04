'use client';
import { addReactionTp } from '@/app/lib/actions';
import { dataTpResponses } from '@/app/types';
import { tps_reactions } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { TbAlertHexagon } from 'react-icons/tb';

export default function ButtonReactionTp({
  response,
}: {
  response: dataTpResponses;
}) {
  const [stateLike, setStateLike] = useState<boolean>(false);
  const [stateDislike, setStateDislike] = useState<boolean>(false);
  const [numberLike, setNumberLike] = useState<number>(
    response.reactions.filter((reaction) => reaction.reaction).length
  );
  const [numberDislike, setNumberDislike] = useState<number>(
    response.reactions.length - numberLike
  );
  const { data: session } = useSession();

  async function handleLike(reaction: boolean) {
    if (session?.user?.id) {
      if (!reaction) {
        setStateDislike(!stateDislike);
        if (stateDislike) setNumberDislike(numberDislike - 1);
        else setNumberDislike(numberDislike + 1);
        if (stateLike) {
          setStateLike(false);
          setNumberLike(numberLike - 1);
        }
      } else {
        setStateLike(!stateLike);
        if (stateLike) setNumberLike(numberLike - 1);
        else setNumberLike(numberLike + 1);
        if (stateDislike) {
          setStateDislike(false);
          setNumberDislike(numberDislike - 1);
        }
      }
      await addReactionTp({
        id: session.user.id,
        id_response: response.response.id,
        reaction: reaction,
      });
    } else {
      window.alert('Deberás iniciar sesion para reaccionar al problema.');
    }
  }

  useEffect(() => {
    const reactions = response.reactions;
    setNumberLike(reactions.filter((reaction) => reaction.reaction).length);
    setNumberDislike(reactions.length - numberLike);
    const reaction = reactions.find(
      (reaction) => reaction.id_user == session?.user.id
    );
    if (reaction) {
      setStateLike(reaction.reaction);
      setStateDislike(!reaction.reaction);
    } else {
      setStateLike(false);
      setStateDislike(false);
    }
  }, [session]);

  useEffect(() => {}, [response]);

  return (
    <span className="flex absolute bottom-0 right-0 z-10 gap-1 p-1 bg-[--white] rounded-md">
      <button
        className="flex"
        aria-label="Dar me gusta"
        title="Me gusta"
        onClick={() => handleLike(true)}
      >
        <AiFillLike
          className={(stateLike ? 'text-green-500' : '') + ' text-xl'}
        />
        {numberLike != undefined ? numberLike : '-'}
      </button>
      <button
        className="flex"
        aria-label="Reportar"
        title="Reportar"
        onClick={() => handleLike(false)}
      >
        <TbAlertHexagon
          className={(stateDislike ? 'text-red-500' : '') + ' text-xl'}
        />
        {numberDislike != undefined ? numberDislike : '-'}
      </button>
    </span>
  );
}
