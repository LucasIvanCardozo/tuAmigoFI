'use client'
import { upsertReaction } from '@/app/lib/server/actions/reactions/upsert.action'
import { DataModuleResponse } from '@/app/types'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { AiFillLike } from 'react-icons/ai'
import { TbAlertHexagon } from 'react-icons/tb'

export default function ButtonReaction({ indexResponse, responses }: { indexResponse: number; responses: DataModuleResponse[] }) {
  const [stateReaction, setStateReaction] = useState<boolean | null>(null)
  const [amountReaction, setAmountReaction] = useState<{ likes: number; dislikes: number }>({ likes: 0, dislikes: 0 })
  const { data: session } = useSession()

  async function handleLike(reaction: boolean) {
    if (session?.user?.id) {
      const response = responses[indexResponse]
      setStateReaction(reaction == stateReaction ? null : reaction)
      setAmountReaction(
        reaction == stateReaction
          ? {
              likes: reaction ? amountReaction.likes - 1 : amountReaction.likes,
              dislikes: reaction ? amountReaction.dislikes : amountReaction.dislikes - 1,
            }
          : stateReaction == null
            ? {
                likes: reaction ? amountReaction.likes + 1 : amountReaction.likes,
                dislikes: reaction ? amountReaction.dislikes : amountReaction.dislikes + 1,
              }
            : {
                likes: reaction ? amountReaction.likes + 1 : amountReaction.likes - 1,
                dislikes: reaction ? amountReaction.dislikes - 1 : amountReaction.dislikes + 1,
              }
      )
      const { error } = await upsertReaction({
        idTarget: response.response.id,
        typeTarget: 'RESPONSE',
        reaction: reaction,
      })
      if (error) throw new Error(error)
    } else {
      window.alert('Debes iniciar sesion para reaccionar a la respuesta.')
    }
  }

  useEffect(() => {
    const reactions = responses[indexResponse].reactions
    const likes = reactions.filter((reaction) => reaction.reaction).length
    const dislikes = reactions.length - likes
    setAmountReaction({ likes, dislikes })
    const reaction = reactions.find((reaction) => reaction.idUser == session?.user.id)
    setStateReaction(reaction ? reaction.reaction : null)
  }, [session, responses, indexResponse])

  return (
    <>
      <button className="flex" aria-label="Dar me gusta" title="Me gusta" onClick={() => handleLike(true)}>
        <AiFillLike className={(stateReaction == true ? 'text-green-500' : '') + ' text-xl'} />
        {amountReaction.likes}
      </button>
      <button className="flex" aria-label="Reportar" title="Reportar" onClick={() => handleLike(false)}>
        <TbAlertHexagon className={(stateReaction == false ? 'text-red-500' : '') + ' text-xl'} />
        {amountReaction.dislikes}
      </button>
    </>
  )
}
