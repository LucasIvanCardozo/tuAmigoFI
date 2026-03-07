'use client'
import { createComment } from '@/app/lib/server/actions/comments/create.action'
import { Comment } from './comment'
import { DataModuleComment } from '@/app/types'
import { Response } from '@/app/lib/server/db/prisma/prismaClient/client'
import { useReload } from '@/app/hooks/useReload'
import { sileo } from 'sileo'
import { useSession } from 'next-auth/react'

interface Params {
  comments: DataModuleComment[]
  response: Response
}

export const CommentsLi = ({ comments, response }: Params) => {
  const { startReload } = useReload()
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const text = formData.get('comment')
    if (!session) throw new Error('No hay sesion')
    await sileo.promise(
      async () => {
        const { error } = await createComment({
          idResponse: response.id,
          text,
        })
        if (error) throw new Error(error)
        startReload()
      },
      {
        loading: { title: 'Publicando comentario...' },
        success: { title: 'Comentario publicado' },
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
    <div className="mx-2 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.5)]">
      <form className="flex p-1 gap-1 bg-blue-300" onSubmit={(e) => handleSubmit(e)}>
        <input className="grow" name="comment" type="text" placeholder="Coloca tu comentario..." />
        <button type="submit">Publicar</button>
      </form>
      {comments.length > 0 ? (
        <ul className="w-full flex flex-col gap-1 p-1">
          {comments.map((comment) => (
            <Comment key={comment.comment.id} comment={comment} />
          ))}
        </ul>
      ) : (
        <p>No hay comentarios por el momento :D</p>
      )}
    </div>
  )
}
