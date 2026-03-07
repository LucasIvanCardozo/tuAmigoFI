// 'src/app/components/ModalImportImage.tsx'
'use client'
import { Modal } from './Modal'
import { Course } from '@/app/lib/server/db/prisma/prismaClient/client'
import { useSession } from 'next-auth/react'
import { FormEvent, use, useRef, useState } from 'react'
import { ModalRef } from './Modal'
import { createCorrelative } from '@/app/lib/server/actions/correlatives/create.action'
import { sileo } from 'sileo'
import { useReload } from '@/app/hooks/useReload'

export default function ModalCreateCorrelative({ course, callback }: { course: Course; callback: Promise<Pick<Course, 'id' | 'name'>[]> }) {
  const [idCorrelative, setIdCorrelative] = useState<string | undefined>()
  const { data: session } = useSession()
  const courses = use(callback)
  const modalRef = useRef<ModalRef>(null)
  const { startReload } = useReload()
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await sileo.promise(
      async () => {
        if (!idCorrelative) throw new Error('Debes seleccionar una correlativa')
        if (!session) throw new Error('No hay sesion')
        if (session.user.tier == 0) throw new Error('Debes tener un rango superior para añadir correlativas')
        const { error } = await createCorrelative({
          idCourse: course.id,
          idCorrelativeCourse: idCorrelative,
        })
        if (error) throw new Error(error)
        modalRef.current?.close()
        startReload()
      },
      {
        loading: { title: 'Cargando...' },
        success: { title: 'Correlativa creada' },
        error: (error) => {
          return { title: (error as Error).message }
        },
      }
    )
  }

  return (
    <Modal
      refAux={modalRef}
      opener={
        <button aria-label="Añadir correlativa" title="Añadir correlativa">
          Añadir correlativa
        </button>
      }
    >
      <form className="relative flex flex-col w-full" onSubmit={handleSubmit}>
        <div>
          <h3 className="text-lg mb-4">
            <b>Añadir correlativa</b>
          </h3>
          <div className="flex flex-col [&>*]:flex [&>*]:gap-1">
            <div className="flex flex-col">
              <label htmlFor="correlative">Correlativa</label>
              <select className="text-black" name="correlative" id="correlative" onChange={(e) => setIdCorrelative(e.target.value)} required>
                {courses ? (
                  <>
                    <option hidden>Selecciona la materia correlativa</option>
                    {courses.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option hidden>Cargando...</option>
                )}
              </select>
            </div>
          </div>
        </div>
        <div className="my-2">
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor verifica que el link que quiere subir sea el correcto. Los links tienen que ser de alta prioridad. En caso de cualquier problema podes
            contactarme:{' '}
            <a className="underline" target="_blank" href="https://wa.me/+5492235319564">
              2235319564
            </a>
          </p>
        </div>
        <div className="flex justify-center">
          <button className="px-2 py-1 border-slate-700 border-2 rounded-md hover:bg-slate-700  transition-colors" type="submit">
            Aceptar
          </button>
        </div>
      </form>
    </Modal>
  )
}
