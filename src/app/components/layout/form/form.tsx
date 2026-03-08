import { useForm } from '@/app/contexts'
import { DataForm } from '@/app/types'
import { FormEvent, useEffect } from 'react'
import { sileo } from 'sileo'

export const Form = ({ children, onSubmit, onEnd }: DataForm) => {
  const { values, setValues } = useForm()

  useEffect(() => {
    return () => {
      setValues([])
    }
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sileo.promise(
      async () => {
        if (values.some((val) => !val.validate)) throw new Error('No deberías hacer esto...')
        await onSubmit(values)
        if (onEnd) onEnd()
      },
      {
        loading: { title: 'Cargando...' },
        success: { title: 'Muchas gracias por tu aporte! ❤️' },
        error: (error) => ({ title: (error as Error).message }),
      }
    )
  }

  return (
    <form className="relative flex flex-col w-full" onSubmit={(e) => handleSubmit(e)}>
      {children}
      <div className="flex gap-4 justify-center mt-4">
        <button className="px-2 py-1 border-slate-700 border-2 rounded-md hover:bg-slate-700  transition-colors" type="submit">
          Aceptar
        </button>
      </div>
    </form>
  )
}
