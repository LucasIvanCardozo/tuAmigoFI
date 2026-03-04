import { MdDelete } from 'react-icons/md'
import { Modal } from './Modal'
import { Form } from '../form/form'
import { TypeValues } from '@/app/types'
import { useMainContext } from '@/app/contexts'
import { useSession } from 'next-auth/react'
import { deleteTP } from '@/app/lib/server/actions/actions'
import { Tp, User } from '@/app/lib/server/db/prisma/prismaClient/client'
import { HandlerInputs } from '../form/inputs/handlerInputs'

export const ModalDeleteTp = ({ tp, user }: { tp: Tp; user: User }) => {
  const { stateModules } = useMainContext()
  const { data: session } = useSession()

  const submitDeleteModule = async (values: TypeValues[]) => {
    const check = values.find((val) => val.id == 'check')
    try {
      if (check && typeof check.value === 'boolean') {
        if ((session && session?.user?.tier == 2) || session?.user.id == tp.idUser) {
          const formData = new FormData()
          formData.set('id', tp.id.toString())
          formData.set('subFolder', `tps/respuestas/${tp.id}`)
          const res = await fetch('/api/destroyAll', {
            method: 'POST',
            body: formData,
          })

          formData.set('id', tp.id.toString())
          formData.set('subFolder', `tps/problemas`)

          const res2 = await fetch('/api/destroy', {
            method: 'POST',
            body: formData,
          })

          if (res.ok && res2.ok) {
            await deleteTP({ id: tp.id })
            try {
              stateModules.setModules(stateModules.modules.filter((mod) => mod.module.id != tp.id))
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
        <button title="Eliminar TP" aria-label="Eliminar TP">
          <MdDelete />
        </button>
      }
    >
      <h2 className="text-lg">Eliminar TP</h2>
      <Form onSubmit={(e: TypeValues[]) => submitDeleteModule(e)}>
        <div className="flex flex-col [&>*]:flex [&>*]:gap-1">
          <p>
            <b>Nombre:</b>
            {tp.name}
          </p>
          <p>
            <b>Subido por:</b>
            {user.name}
          </p>

          <p>
            <b>Año:</b>
            {tp.year}
          </p>
          <p>
            <b>Numero:</b>
            {tp.number || 'No tiene'}
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
