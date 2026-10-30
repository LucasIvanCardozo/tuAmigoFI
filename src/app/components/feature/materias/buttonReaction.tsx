'use client';
import type { DataModuleResponse } from '@/app/types';
import { ReactionButtons } from './reactionButtons';
import { useReactions } from './useReactions';

export default function ButtonReaction({
  indexResponse,
  responses,
}: {
  indexResponse: number;
  responses: DataModuleResponse[];
}) {
  const response = responses[indexResponse];
  const { state, amount, pending, react } = useReactions({
    idTarget: response.response.id,
    typeTarget: 'RESPONSE',
    reactions: response.reactions,
    unauthorizedMessage: 'Debes iniciar sesion para reaccionar a la respuesta.',
  });

  return (
    <ReactionButtons
      state={state}
      amount={amount}
      pending={pending}
      onLike={() => react(true)}
      onDislike={() => react(false)}
    />
  );
}
