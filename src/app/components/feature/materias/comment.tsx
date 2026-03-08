'use client'
import { useReload } from '@/app/hooks/useReload'
import { upsertReaction } from '@/app/lib/server/actions/reactions/upsert.action'
import { DataModuleComment } from '@/app/types'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { AiFillLike } from 'react-icons/ai'
import { sileo } from 'sileo'

interface Params {
  comment: DataModuleComment
}

export const Comment = ({ comment }: Params) => {
  const [numberLike, setNumberLike] = useState(comment.reactions.length)
  const [stateLike, setStateLike] = useState(false)
  const { data: session } = useSession()
  const { startReload } = useReload()

  useEffect(() => {
    if (comment.reactions.find((reaction) => reaction.reaction && reaction.idUser === session?.user?.id)) setStateLike(true)
  }, [comment])

  const handleLike = async () => {
    setStateLike(!stateLike)
    setNumberLike(stateLike ? numberLike - 1 : numberLike + 1)
    const { error } = await upsertReaction({ idTarget: comment.comment.id, typeTarget: 'COMMENT', reaction: !stateLike })
    if (error) sileo.error({ title: error })
    startReload()
  }

  return (
    <div className="flex items-start gap-2 p-1 bg-white rounded-lg shadow-sm">
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-800">{comment.user.name}</h4>
        <p className="mt-1 text-sm text-gray-700">{comment.comment.text}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
          aria-label="Dar me gusta"
          title="Me gusta"
          onClick={handleLike}
        >
          <AiFillLike className={(stateLike ? 'text-green-500' : 'text-gray-400') + ' text-xl'} />
          <span className="text-sm font-medium text-gray-600">{numberLike}</span>
        </button>
      </div>
    </div>
  )
}
