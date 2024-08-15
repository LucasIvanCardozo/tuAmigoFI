'use client';
import { addReaction } from '@/app/lib/actions';
import { useEffect, useState } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { TbAlertHexagon } from 'react-icons/tb';

export default function ButtonReaction({
  problems,
  uuid,
}: {
  problems: {
    number: number | null;
    response_plus: string | null;
    text: string;
    type_plus: string | null;
    response: string | null;
    type: string | null;
    id: number;
    text_normalized: string;
    user_reactions: {
      id: number;
      id_problem: number;
      reaction: number;
      id_user: string;
      created_at: Date | null;
    }[];
  };
  uuid: string;
}) {
  const [stateLike, setStateLike] = useState<boolean>(false);
  const [stateDislike, setStateDislike] = useState<boolean>(false);
  const [numberLike, setNumberLike] = useState<number>(0);
  const [numberDislike, setNumberDislike] = useState<number>(0);
  async function handleLike(reaction: number) {
    if (uuid.length == 36) {
      if (reaction == 0) {
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
      await addReaction({
        uuid: uuid,
        id_problem: problems.id,
        reaction: reaction,
      });
      console.log('reaccion añadida!');
    } else {
      throw new Error('Editaste el localStorage... Así no eh!');
    }
  }
  useEffect(() => {
    const likesTotal = problems.user_reactions.filter(
      (reaction) => reaction.reaction == 1
    ).length;
    if (problems.user_reactions.length > 0)
      console.log(problems.user_reactions);
    setNumberLike(likesTotal);
    setNumberDislike(problems.user_reactions.length - likesTotal);
  }, []);

  useEffect(() => {
    const reaction = problems.user_reactions?.find(
      (reaction) => reaction.id_user == uuid
    );

    if (reaction) {
      if (reaction.reaction == 1) {
        setStateLike(true);
      } else {
        setStateDislike(true);
      }
    }
  }, [uuid]);

  return (
    <span className="flex absolute bottom-0 right-0 z-10 gap-1">
      <button className="flex" onClick={() => handleLike(1)}>
        <AiFillLike
          className={(stateLike ? 'text-green-500' : '') + ' text-xl'}
        />
        {numberLike}
      </button>
      <button className="flex" onClick={() => handleLike(0)}>
        <TbAlertHexagon
          className={(stateDislike ? 'text-red-500' : '') + ' text-xl'}
        />
        {numberDislike}
      </button>
    </span>
  );
}
