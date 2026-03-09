'use client'
import { MdDelete } from 'react-icons/md'
import { Modal, ModalRef } from './Modal'
import { Form } from '../form/form'
import { TypeValues } from '@/app/types'
import { Tp, User } from '@/app/lib/server/db/prisma/prismaClient/client'
import { HandlerInputs } from '../form/inputs/handlerInputs'
import { useRef } from 'react'
import { useReload } from '@/app/hooks/useReload'
import { deleteTp } from '@/app/lib/server/actions/tps/delete.action'
import { Session } from 'next-auth'

export const ModalDeleteTp = ({ tp, user, session }: { tp: Tp; user: User; session: Session | null }) => {
  const { startReload } = useReload()
  const modalRef = useRef<ModalRef>(null)

  const submitDeleteModule = async (values: TypeValues[]) => {
    const check = values.find((val) => val.id == 'check')
    if (!check) throw new Error('Debes estar de acuerdo con la eliminacion del TP')
    if (!session) throw new Error('No hay sesion')
    console.log(session.user.id)
    console.log(user.id)
    if (session.user.tier != 2 && session.user.id != user.id) throw new Error('Debes ser administrador o el creador para eliminar un TP')

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
      const { error } = await deleteTp({ id: tp.id, idUser: tp.idUser })
      if (error) throw new Error(error)
      startReload()
    }
  }

  return (
    <Modal
      refAux={modalRef}
      opener={
        <button title="Eliminar TP" aria-label="Eliminar TP">
          <MdDelete />
        </button>
      }
    >
      <h2 className="text-lg">Eliminar TP</h2>
      <Form onSubmit={(e: TypeValues[]) => submitDeleteModule(e)} onEnd={modalRef.current?.close}>
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
