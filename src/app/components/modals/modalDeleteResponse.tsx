import { MdDelete } from 'react-icons/md'
import { Modal } from './Modal'
import { Form } from '../form/form'
import { TypeValues } from '@/app/types'
import { HandlerInputs } from '../form/inputs/handlerInputs'
import { Response, User } from '@/app/lib/server/db/prisma/prismaClient/client'
import { useSession } from 'next-auth/react'
import { deleteResponse } from '@/app/lib/server/actions/actions'

export const ModalDeleteResponse = ({ response, user }: { response: Response; user: User }) => {
  // const { stateModules } = useMainContext()
  const { data: session } = useSession()

  const submitDeleteResponse = async (values: TypeValues[]) => {
    const check = values.find((val) => val.id == 'check')
    try {
      if (check && typeof check.value === 'boolean') {
        if ((session && session?.user?.tier == 2) || session?.user.id == response.idUser) {
          const deleteModuleDB = async () => {
            await deleteResponse({
              id: response.id,
            })
            window.location.reload()
            // try {
            //   const indexResponseAux = indexResponse
            //   setIndexResponse((indexResponse) => 0)
            //   stateModules.setModules(
            //     stateModules.modules.map((mod) =>
            //       (mod.module.id == responses[indexResponseAux].response.idTp && isTp) ||
            //       (mod.module.id == responses[indexResponseAux].response.idMidterm && !isTp)
            //         ? {
            //             ...mod,
            //             problems: mod.problems.map((pro) =>
            //               pro.number == problem.number
            //                 ? {
            //                     ...pro,
            //                     responses: pro.responses.filter((res) => res.response.id != responses[indexResponseAux].response.id),
            //                   }
            //                 : pro
            //             ),
            //           }
            //         : mod
            //     )
            //   )
            // } catch (error) {
            //   window.location.reload()
            // }
          }
          if (response.type == 'IMAGE' || response.type == 'PDF') {
            const formData = new FormData()
            formData.set('id', response.idUser)
            formData.set(
              'subFolder',
              `${response.idTp ? 'tps' : 'parciales'}/respuestas/${response.idTp ? response.idTp : response.idMidterm}/${response.number}`
            )
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
      } else {
        throw new Error('Faltan completar datos.')
      }
    } catch (error) {
      throw error
    }
  }
  return (
    <Modal
      opener={
        <button aria-label="Eliminar respuesta" title="Eliminar respuesta">
          <MdDelete className="h-full w-full" />
        </button>
      }
    >
      <h2 className="text-lg">Eliminar respuesta</h2>
      <Form onSubmit={(e: TypeValues[]) => submitDeleteResponse(e)}>
        <div>
          <div className="flex flex-col [&>*]:flex [&>*]:gap-1">
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
