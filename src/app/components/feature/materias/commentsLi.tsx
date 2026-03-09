'use client'
import { createComment } from '@/app/lib/server/actions/comments/create.action'
import { Comment } from './comment'
import { DataModuleComment } from '@/app/types'
import { Response } from '@/app/lib/server/db/prisma/prismaClient/client'
import { useReload } from '@/app/hooks/useReload'
import { sileo } from 'sileo'
import { useState } from 'react'
import { Session } from 'next-auth'

interface Params {
  comments: DataModuleComment[]
  response: Response
  session: Session | null
}

export const CommentsLi = ({ comments, response, session }: Params) => {
  const { startReload } = useReload()
  const [inputText, setInputText] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const text = formData.get('comment')
    sileo.promise(
      async () => {
        if (!session) throw new Error('No hay sesion')
        const { error } = await createComment({
          idResponse: response.id,
          text,
        })
        if (error) throw new Error(error)
        setInputText('')
        startReload()
      },
      {
        loading: { title: 'Publicando comentario...' },
        success: { title: 'Muchas gracias por tu aporte! ❤️' },
        error: (error) => {
          const err = error as Error
          return {
            title: err.message,
          }
        },
      }
    )
  }
  return (
    <div className="mx-1 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.5)]">
      <form className="flex p-1 gap-1  bg-slate-200" onSubmit={handleSubmit}>
        <input
          className="grow"
          name="comment"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Coloca tu comentario..."
        />
        <button type="submit">Publicar</button>
      </form>
      {comments.length > 0 ? (
        <ul className="w-full flex flex-col gap-1 p-1">
          {comments.map((comment) => (
            <Comment key={comment.comment.id} comment={comment} session={session} />
          ))}
        </ul>
      ) : (
        <p>No hay comentarios por el momento :D</p>
      )}
    </div>
  )
}
