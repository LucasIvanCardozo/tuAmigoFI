import { useForm } from '@/app/contexts'
import { DataForm } from '@/app/types'
import { FormEvent, useEffect, useState, useTransition } from 'react'
import { Loading } from '../loading'

export const Form = ({ children, onSubmit, onEnd }: DataForm) => {
  const [loading, startTransition] = useTransition()
  const { values, setValues, error, setError } = useForm()
  const [thanks, setThanks] = useState(false)

  useEffect(() => {
    return () => {
      setValues([])
      setError(undefined)
    }
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!values.some((val) => !val.validate)) {
        startTransition(async () => {
          await onSubmit(values)
          setThanks(true)
          if (onEnd) {
            setTimeout(() => {
              onEnd()
            }, 1200)
          }
        })
      } else {
        throw new Error('No deberías hacer esto...')
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else setError('Error inesperado')
    }
  }

  return (
    <form className="relative flex flex-col w-full" onSubmit={(e) => handleSubmit(e)}>
      {children}
      {error && <p className="text-red-500">{`Error: ${error}`}</p>}
      <div className="flex gap-4 justify-center mt-4">
        {thanks ? (
          <p>Muchas gracias por tu aporte! ❤️</p>
        ) : loading ? (
          <Loading size={6} mode="white" />
        ) : (
          <button className="px-2 py-1 border-slate-700 border-2 rounded-md hover:bg-slate-700  transition-colors" type="submit">
            Aceptar
          </button>
        )}
      </div>
    </form>
  )
}
