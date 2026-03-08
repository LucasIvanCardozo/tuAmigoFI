import { TypeValues } from '@/app/types'
import { Form } from '../form/form'
import { Modal, ModalRef } from './Modal'
import { MdDelete } from 'react-icons/md'
import { HandlerInputs } from '../form/inputs/handlerInputs'
import { Midterm, User } from '@/app/lib/server/db/prisma/prismaClient/client'
import { useSession } from 'next-auth/react'
import { useRef } from 'react'
import { useReload } from '@/app/hooks/useReload'
import { deleteMidterm } from '@/app/lib/server/actions/midterms/delete.action'

export const ModalDeleteMidterm = ({ midterm, user }: { midterm: Midterm; user: User }) => {
  const { startReload } = useReload()

  const modalRef = useRef<ModalRef>(null)
  const { data: session } = useSession()

  const submitDeleteModule = async (values: TypeValues[]) => {
    const check = values.find((val) => val.id == 'check')
    if (!session) throw new Error('No hay sesion')
    if (session.user.tier != 2 && session.user.id != user.id) throw new Error('Debes ser administrador o el creador para eliminar un examen')
    if (!check) throw new Error('Debes estar de acuerdo con la eliminacion del examen')

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
      const { error } = await deleteMidterm({ id: midterm.id, idUser: midterm.idUser })
      if (error) throw new Error(error)
      startReload()
    }
  }

  return (
    <Modal
      refAux={modalRef}
      opener={
        <button title="Eliminar Examen" aria-label="Eliminar Examen">
          <MdDelete />
        </button>
      }
    >
      <h2 className="text-lg">Eliminar Examen</h2>
      <Form onSubmit={(e: TypeValues[]) => submitDeleteModule(e)} onEnd={modalRef.current?.close}>
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
