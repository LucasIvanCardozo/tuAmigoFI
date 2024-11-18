'use client';
import { addReactionTp } from '@/app/lib/actions';
import { fetchUserReactionTp } from '@/app/lib/data';
import { tps_responses } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { TbAlertHexagon } from 'react-icons/tb';

export default function ButtonReactionTp({
  response,
}: {
  response: tps_responses;
}) {
  const [stateLike, setStateLike] = useState<boolean>(false);
  const [stateDislike, setStateDislike] = useState<boolean>(false);
  const [numberLike, setNumberLike] = useState<number | undefined>();
  const [numberDislike, setNumberDislike] = useState<number | undefined>();
  const { data: session } = useSession();

  async function handleLike(reaction: boolean) {
    if (session?.user?.id) {
      if (numberDislike && numberLike) {
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
          id_response: response.id,
          reaction: reaction,
        });
      }
    } else {
      window.alert('Deberás iniciar sesion para reaccionar al problema.');
    }
  }

  useEffect(() => {
    const searchReactions = async () => {
      const totalReactions = await fetchUserReactionTp(response.id);
      const likesTotal = totalReactions.filter(
        (reaction) => reaction.reaction
      ).length;
      setNumberLike(likesTotal);
      setNumberDislike(totalReactions.length - likesTotal);
      const reaction = totalReactions.find(
        (reaction) => reaction.id_user == session?.user?.id
      );
      if (reaction) {
        if (reaction.reaction) {
          setStateLike(true);
          setStateDislike(false);
        } else {
          setStateDislike(true);
          setStateLike(false);
        }
      } else {
        setStateDislike(false);
        setStateLike(false);
      }
    };
    searchReactions();
  }, [session, response]);

  return (
    <span className="flex absolute bottom-0 right-0 z-10 gap-1 p-1 bg-[--white] rounded-md">
      <button className="flex" onClick={() => handleLike(true)}>
        <AiFillLike
          className={(stateLike ? 'text-green-500' : '') + ' text-xl'}
        />
        {numberLike != undefined ? numberLike : '-'}
      </button>
      <button className="flex" onClick={() => handleLike(false)}>
        <TbAlertHexagon
          className={(stateDislike ? 'text-red-500' : '') + ' text-xl'}
        />
        {numberDislike != undefined ? numberDislike : '-'}
      </button>
    </span>
  );
}
