import { TypeValues } from '@/app/types'
import { Form } from '../form/form'
import { Modal } from './Modal'
import { HandlerInputs } from '../form/inputs/handlerInputs'
import { useMainContext } from '@/app/contexts'
import { useSession } from 'next-auth/react'
import { createMidterm } from '@/app/lib/server/actions/actions'
import { Course } from '@/app/lib/server/db/prisma/prismaClient/client'

export const ModalAddMidterm = ({ course }: { course: Course }) => {
  const { stateModules } = useMainContext()
  const { data: session } = useSession()

  const submitAddModule = async (values: TypeValues[]) => {
    const name = values.find((val) => val.id == 'name')
    const date = values.find((val) => val.id == 'date')
    const file = values.find((val) => val.id == 'file')
    try {
      if (date && name && file && typeof name.value == 'string' && file.value instanceof File && typeof date.value == 'string') {
        if (session) {
          let module

          module = await createMidterm({
            name: name.value,
            date: new Date(date?.value as string),
            idCourse: course.id,
            idUser: session.user.id,
          })

          if (module) {
            const formData = new FormData()
            formData.set('file', file.value)
            formData.set('id', module.id.toString())
            formData.set('subFolder', `parciales/problemas`)

            await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            })
            try {
              stateModules.setModules([
                ...stateModules.modules,
                {
                  user: {
                    id: session.user.id,
                    email: session.user.email as string,
                    name: session.user.name as string,
                    banned: false,
                    tier: session.user.tier,
                    image: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                  problems: [],
                  module: module,
                },
              ])
            } catch (error) {
              window.location.reload()
            }
          }
        }
      } else throw new Error('Faltan completar datos.')
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
      else throw new Error('Error inesperado.')
    }
  }

  return (
    <Modal
      opener={
        <button className="text-start bg-[--white] py-1 px-2 rounded-md">
          <p className="text-base text-[--black-olive] leading-4">Agregar Examen</p>
        </button>
      }
    >
      <h2 className="text-lg">Agregar TP</h2>
      <Form onSubmit={(e: TypeValues[]) => submitAddModule(e)}>
        <div className="flex flex-col">
          <label htmlFor="name">Título</label>
          <HandlerInputs
            type="select"
            placeholder="Selecciona el tipo de parcial"
            id="name"
            name="name"
            required={true}
            children={
              <>
                <option value="Primer parcial">Primer parcial</option>
                <option value="Segundo parcial">Segundo parcial</option>
                <option value="Tercer parcial">Tercer parcial</option>
                <option value="Final">Final</option>
                <option value="Otros">Otros</option>
              </>
            }
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="date">Fecha</label>
          <HandlerInputs type="date" name="date" id="date" required={true} />
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
