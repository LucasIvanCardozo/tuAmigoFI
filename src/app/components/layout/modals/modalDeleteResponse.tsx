import { MdDelete } from 'react-icons/md'
import { Modal, ModalRef } from './Modal'
import { Form } from '../form/form'
import { TypeValues } from '@/app/types'
import { HandlerInputs } from '../form/inputs/handlerInputs'
import { Response, User } from '@/app/lib/server/db/prisma/prismaClient/client'
import { useSession } from 'next-auth/react'
import { useRef } from 'react'
import { useReload } from '@/app/hooks/useReload'
import { deleteResponse } from '@/app/lib/server/actions/responses/delete.action'

export const ModalDeleteResponse = ({ response, user }: { response: Response; user: User }) => {
  const { id, idUser } = response
  const modalRef = useRef<ModalRef>(null)
  const { startReload } = useReload()
  const { data: session } = useSession()

  const submitDeleteResponse = async (values: TypeValues[]) => {
    const check = values.find((val) => val.id == 'check')
    if (!check) throw new Error('Debes estar de acuerdo con la eliminacion de la respuesta')
    if (!session) throw new Error('No hay sesion')
    if (session.user.tier != 2 && session.user.id != user.id) throw new Error('Debes ser administrador o el creador para eliminar una respuesta')

    const deleteModuleDB = async () => {
      const { error } = await deleteResponse({ id, idUser })
      if (error) throw new Error('Error: ' + error)
      startReload()
    }
    if (response.type == 'IMAGE' || response.type == 'PDF') {
      const formData = new FormData()
      formData.set('id', response.idUser)
      formData.set('subFolder', `${response.idTp ? 'tps' : 'parciales'}/respuestas/${response.idTp ? response.idTp : response.idMidterm}/${response.number}`)
      const res = await fetch('/api/destroy', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        deleteModuleDB()
      } else throw new Error('Error al eliminar respuesta')
    } else {
      deleteModuleDB()
    }
  }

  return (
    <Modal
      refAux={modalRef}
      opener={
        <button aria-label="Eliminar respuesta" title="Eliminar respuesta">
          <MdDelete className="h-full w-full" />
        </button>
      }
    >
      <h2 className="text-lg">Eliminar respuesta</h2>
      <Form onSubmit={(e: TypeValues[]) => submitDeleteResponse(e)} onEnd={() => modalRef.current?.close()}>
        <div>
          <div className="flex flex-col *:flex *:gap-1">
            <p>
              <b>Numero del problema:</b>
              {response.number}
            </p>
            <p>
              <b>Subida por:</b>
              {user.name}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor asegurate de que la respuesta sea la que quieres eliminar. Se borrara esta misma con todas sus reacciones. En caso de cualquier problema
            podés contactarme:{' '}
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
