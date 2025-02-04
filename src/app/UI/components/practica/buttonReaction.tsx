'use client';
import { addReactionTp } from '@/app/lib/actions';
import { useMainContext } from '@/app/lib/context';
import { DataModuleResponse } from '@/app/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { TbAlertHexagon } from 'react-icons/tb';

export default function ButtonReaction({
  indexResponse,
  responses,
  setResponses,
}: {
  indexResponse: number;
  responses: DataModuleResponse[];
  setResponses: Dispatch<SetStateAction<DataModuleResponse[]>>;
}) {
  const [stateLike, setStateLike] = useState<boolean>(false);
  const [stateDislike, setStateDislike] = useState<boolean>(false);
  const [numberLike, setNumberLike] = useState<number>(0);
  const [numberDislike, setNumberDislike] = useState<number>(0);
  const { session } = useMainContext();

  async function handleLike(reaction: boolean) {
    if (session?.user?.id) {
      const response = responses[indexResponse];
      const reactions = response.reactions;
      const idUser = session.user.id;
      const findReaction = reactions.find(
        (reaction) => reaction.id_user == idUser
      );
      if (findReaction) {
        if (findReaction.reaction == reaction) {
          setResponses(
            responses.map((res, index) =>
              index == indexResponse
                ? {
                    ...res,
                    reactions: res.reactions.filter(
                      (rea) => rea.id_user != idUser
                    ),
                  }
                : res
            )
          );
        } else {
          const updatedResponses = responses.map((res, index) =>
            index == indexResponse
              ? {
                  ...res,
                  reactions: res.reactions.map((rea) =>
                    rea.id_user == idUser ? { ...rea, reaction: reaction } : rea
                  ),
                }
              : res
          );
          setResponses(updatedResponses);
        }
      } else {
        setResponses(
          responses.map((res, index) =>
            index == indexResponse
              ? {
                  ...res,
                  reactions: [
                    ...res.reactions,
                    {
                      id: Math.floor(Math.random() * 1000),
                      id_user: idUser,
                      id_response: res.response.id,
                      reaction: reaction,
                      created_at: new Date(Date.now()),
                    },
                  ],
                }
              : res
          )
        );
      }
      await addReactionTp({
        id: session.user.id,
        id_response: response.response.id,
        reaction: reaction,
      });
    } else {
      window.alert('Debes iniciar sesion para reaccionar a la respuesta.');
    }
  }

  useEffect(() => {
    const reactions = responses[indexResponse].reactions;
    const numberLikeAux = reactions.filter(
      (reaction) => reaction.reaction
    ).length;
    const numberDislikeAux = reactions.length - numberLikeAux;
    setNumberLike(numberLikeAux);
    setNumberDislike(numberDislikeAux);
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
  }, [session, responses, indexResponse]);

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
        {numberLike}
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
        {numberDislike}
      </button>
    </span>
  );
}
