import { DataModuleProblem, DataModuleResponse, Module, TypeValues } from '@/app/types'
import { Form } from '../form/form'
import { Modal } from './Modal'
import { CgMathPlus } from 'react-icons/cg'
import { HandlerInputs } from '../form/inputs/handlerInputs'
import { useMainContext } from '@/app/contexts'
import { useSession } from 'next-auth/react'
import { createResponse } from '@/app/lib/server/actions/actions'

export const ModalAddResponse = ({ module }: { module: Module }) => {
  const { stateModules } = useMainContext()
  const { data: session } = useSession()
  const isTp = 'number' in module

  const submitAddResponse = async (values: TypeValues[]) => {
    const number = values.find((val) => val.id == 'number')
    const selectResponse = values.find((val) => val.id == 'selectResponse')
    try {
      if (
        number &&
        typeof number.value === 'string' &&
        selectResponse &&
        (((selectResponse.inputType == 'TEXT' || selectResponse.inputType == 'CODE') && typeof selectResponse.value == 'string') ||
          ((selectResponse.inputType == 'IMAGE' || selectResponse.inputType == 'PDF') && selectResponse.value instanceof File))
      ) {
        if (session) {
          const typeResponse = selectResponse.inputType
          const addResponse = await createResponse({
            idUser: session.user.id,
            idTp: isTp ? module.id : null,
            idMidterm: !isTp ? module.id : null,
            number: Number(number.value),
            text: selectResponse.inputType == 'TEXT' || selectResponse.inputType == 'CODE' ? (selectResponse.value as string) : null,
            type: typeResponse,
          })

          if (typeResponse == 'IMAGE' || typeResponse == 'PDF') {
            if (selectResponse.value) {
              if (addResponse) {
                const formData = new FormData()
                formData.set('file', selectResponse.value)
                formData.set('id', session.user.id.toString())
                formData.set('subFolder', `${isTp ? 'tps' : 'parciales'}/respuestas/${module.id}/${Number(number.value)}`)
                await fetch('/api/upload', {
                  method: 'POST',
                  body: formData,
                })
              } else {
                throw new Error('Ocurrio un error en la suba de la respuesta')
              }
            } else throw new Error('No se encontro ningun archivo')
          }
          try {
            const responseAux: DataModuleResponse = {
              user: {
                id: session.user.id,
                email: '',
                image: '',
                name: session.user.name as string,
                tier: 0,
                banned: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              response: addResponse,
              // reactions: [],
              comments: [],
            }
            stateModules.setModules(
              stateModules.modules.map((mod) => {
                let newProblems: DataModuleProblem[]
                if (mod.problems.some((pro) => pro.number == addResponse.number)) {
                  newProblems = mod.problems.map((pro) =>
                    pro.number == addResponse.number
                      ? {
                          ...pro,
                          responses: [...pro.responses, responseAux],
                        }
                      : pro
                  )
                } else {
                  newProblems = [...mod.problems, { number: addResponse.number, responses: [responseAux] }]
                }
                return mod.module.id == module.id ? { ...mod, problems: newProblems } : mod
              })
            )
          } catch (error) {
            window.location.reload()
          }
        } else throw new Error('Debes iniciar sesion.')
      } else throw new Error('Faltan completar datos.')
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
      else throw new Error('Error inesperado.')
    }
  }

  return (
    <Modal
      opener={
        <button
          className="flex text-base h-6 pr-1 items-center border-2 border-gray-600 rounded-md hover:bg-[#92C1C9] transition-colors hover:border-[#92C1C9]"
          title="Añadir una respuesta"
          aria-label="Añadir una respuesta"
        >
          <CgMathPlus />
          <span>Respuesta</span>
        </button>
      }
    >
      <h2 className="text-lg">Añadir una respuesta</h2>
      <Form onSubmit={(e: TypeValues[]) => submitAddResponse(e)}>
        <div className="flex flex-col">
          <label htmlFor="number">Número</label>
          <HandlerInputs type="number" id="number" name="number" min={0} max={100} placeholder="Número del problema" required={true} />
        </div>
        <HandlerInputs type="selectResponse" id="selectResponse" required={true} name="selectResponse" />
        <div>
          <p>Esta respuesta se añadirá al módulo "{module.name}"</p>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor asegurate de que las respuestas estén legibles y sean para este módulo. En caso de cualquier problema podes contactarme:{' '}
            <a className="underline" target="_blank" href="https://wa.me/+5492235319564">
              2235319564
            </a>
          </p>
        </div>
      </Form>
    </Modal>
  )
}
