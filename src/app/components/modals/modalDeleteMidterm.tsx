import { TypeValues } from '@/app/types'
import { Form } from '../form/form'
import { Modal } from './Modal'
import { MdDelete } from 'react-icons/md'
import { HandlerInputs } from '../form/inputs/handlerInputs'
import { Midterm, User } from '@/app/lib/server/db/prisma/prismaClient/client'
import { useMainContext } from '@/app/contexts'
import { useSession } from 'next-auth/react'
import { deleteMidterm } from '@/app/lib/server/actions/actions'

export const ModalDeleteMidterm = ({ midterm, user }: { midterm: Midterm; user: User }) => {
  const { stateModules } = useMainContext()
  const { data: session } = useSession()

  const submitDeleteModule = async (values: TypeValues[]) => {
    const check = values.find((val) => val.id == 'check')
    try {
      if (check && typeof check.value === 'boolean') {
        if ((session && session?.user?.tier == 2) || session?.user.id == midterm.idUser) {
          const formData = new FormData()
          formData.set('id', midterm.id.toString())
          formData.set('subFolder', `parciales/respuestas/${midterm.id}`)
          const res = await fetch('/api/destroyAll', {
            method: 'POST',
            body: formData,
          })

          formData.set('id', midterm.id.toString())
          formData.set('subFolder', `parciales/problemas`)

          const res2 = await fetch('/api/destroy', {
            method: 'POST',
            body: formData,
          })

          if (res.ok && res2.ok) {
            await deleteMidterm({ id: midterm.id })
            try {
              stateModules.setModules(stateModules.modules.filter((mod) => mod.module.id != midterm.id))
            } catch (error) {
              window.location.reload()
            }
          } else throw new Error('Error al eliminar esta respuesta')
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
        <button title="Eliminar Examen" aria-label="Eliminar Examen">
          <MdDelete />
        </button>
      }
    >
      <h2 className="text-lg">Eliminar Examen</h2>
      <Form onSubmit={(e: TypeValues[]) => submitDeleteModule(e)}>
        <div className="flex flex-col [&>*]:flex [&>*]:gap-1">
          <p>
            <b>Nombre:</b>
            {midterm.name}
          </p>
          <p>
            <b>Subido por:</b>
            {user.name}
          </p>

          <p>
            <b>Fecha:</b>
            {`${midterm.date.getMonth() + 1}/${midterm.date.getFullYear()}`}
          </p>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor asegurate de que el examen que quieres eliminar sea el correcto. Se eliminaran todos los problemas, las respuestas y sus reacciones. En
            caso de cualquier problema podes contactarme:{' '}
            <a className="underline" target="_blank" href="https://wa.me/+5492235319564">
              2235319564
            </a>
          </p>
        </div>
        <HandlerInputs type="checkbox" id="check" name="check" placeholder="Confirmo la eliminación." required={true} />
      </Form>
    </Modal>
  )
}
