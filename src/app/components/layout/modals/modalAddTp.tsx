'use client'
import { useSession } from 'next-auth/react'
import { Form } from '../form/form'
import { HandlerInputs } from '../form/inputs/handlerInputs'
import { Modal, ModalRef } from './Modal'
import { TypeValues } from '@/app/types'
import { Course } from '@/app/lib/server/db/prisma/prismaClient/client'
import { useRef } from 'react'
import { useReload } from '@/app/hooks/useReload'
import { createTp } from '@/app/lib/server/actions/tps/create.action'

export const ModalAddTp = ({ course }: { course: Course }) => {
  const modalRef = useRef<ModalRef>(null)
  const { startReload } = useReload()
  const { data: session } = useSession()

  const submitAddModule = async (values: TypeValues[]) => {
    const name = values.find((val) => val.id == 'name')
    const year = values.find((val) => val.id == 'year')
    const number = values.find((val) => val.id == 'number')
    const file = values.find((val) => val.id == 'file')
    if (!year || !number || !name || !file || !(file.value instanceof File)) throw new Error('Faltan completar datos.')
    if (!session) throw new Error('No hay sesion')
    const { data, error } = await createTp({
      name: name.value,
      number: Number(number?.value),
      year: Number(year?.value),
      idUser: session.user.id,
      idCourse: course.id,
    })
    if (error) throw new Error('Error: ' + error)
    if (data) {
      const formData = new FormData()
      formData.set('file', file.value)
      formData.set('id', data.id.toString())
      formData.set('subFolder', `tps/problemas`)

      await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
    }
    startReload()
  }

  return (
    <Modal
      refAux={modalRef}
      opener={
        <button className="text-start bg-[--white] py-1 px-2 rounded-md">
          <p className="text-base text-[--black-olive] leading-4">Agregar TP</p>
        </button>
      }
    >
      <h2 className="text-lg">Agregar TP</h2>
      <Form onSubmit={(e: TypeValues[]) => submitAddModule(e)} onEnd={() => modalRef.current?.close()}>
        <div className="flex flex-col">
          <label htmlFor="name">Titulo</label>
          <HandlerInputs id="name" name="name" type="text" placeholder="Título del TP" required={true} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="number">Número</label>
          <HandlerInputs id="number" name="number" type="number" placeholder="Número del TP" min={0} max={30} required={true} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="year">Año</label>
          <HandlerInputs id="year" name="year" type="number" placeholder="Año del TP" min={2000} max={new Date().getFullYear()} required={true} />
        </div>
        <HandlerInputs type="file" id="file" accept="application/pdf" required={true} />
        <div>
          <a href="https://www.ilovepdf.com/es/eliminar-paginas" target="_blank" className="underline">
            <h3 className="text-sm">Click aquí para eliminar páginas de tu PDF</h3>
          </a>
        </div>
        <div>
          <a href="https://tools.pdf24.org/es/convertidor-pdf" target="_blank" className="underline">
            <h3 className="text-sm">Click aquí para convertir a PDF</h3>
          </a>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Solo se admite formato PDF y solo con los problemas (sin las respuestas). Por favor asegurate de que el modulo que quieres agregar no se encuentre
            ya disponible en la lista. En caso de cualquier problema podes contactarme:{' '}
            <a className="underline" target="_blank" href="https://wa.me/+5492235319564">
              2235319564
            </a>
          </p>
        </div>
      </Form>
    </Modal>
  )
}
