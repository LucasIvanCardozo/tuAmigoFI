import { numberIconsModules } from '../../../assets/icons'
import PdfView from '@/app/components/pdfView'
import { DataModule } from '@/app/types'
import { SiGoogledocs } from 'react-icons/si'
import ModuleResponse from './moduleResponse'
import { ModalDeleteTp } from '../../layout/modals/modalDeleteTp'
import { ModalDeleteMidterm } from '../../layout/modals/modalDeleteMidterm'
import { ModalAddResponse } from '../../layout/modals/modalAddResponse'
import { userUseCases } from '@/app/lib/server/usecases/user.usecases'

interface Props {
  module: DataModule
  idModule?: string
  typeModule: 'TP' | 'Practica'
}

export const ModuleContainer = async ({ module, idModule, typeModule }: Props) => {
  const session = await userUseCases.getSession()
  const moduleInd = module.module
  const problems = module.problems
  const isTp = 'number' in moduleInd

  return (
    <li className={'relative ' + `${idModule != null && idModule != moduleInd.id && 'hidden'}`}>
      <div className="flex items-center text-xl sticky top-0 z-20 bg-(--platinum) py-1 ">
        {isTp ? moduleInd.number && numberIconsModules[moduleInd.number] ? numberIconsModules[moduleInd.number] : numberIconsModules[0] : <SiGoogledocs />}
        <h2>
          {moduleInd.name}{' '}
          {isTp ? (
            <p className="inline-block text-base">{`(${moduleInd.year})`}</p>
          ) : (
            <p className="inline-block text-base">{`(${moduleInd.date.getMonth() + 1}/${moduleInd.date.getFullYear()})`}</p>
          )}
        </h2>

        <div className="flex gap-1 px-1 ml-auto">
          {session &&
            (session.user?.tier == 2 || session.user?.id == module.user.id) &&
            (isTp ? (
              <ModalDeleteTp tp={moduleInd} user={module.user} session={session} />
            ) : (
              <ModalDeleteMidterm midterm={moduleInd} user={module.user} session={session} />
            ))}

          <ModalAddResponse module={moduleInd} session={session} />
        </div>
      </div>
      <div className="bg-(--white) text-base leading-5 drop-shadow-md flex flex-col gap-1">
        <div className="relative overflow-hidden bg-[#96cad3] h-min rounded-b-lg p-1 sm:p-2">
          <div className="absolute z-10 bg-(--white) rounded-md m-2 opacity-65 top-0 left-0">{`Por ${module.user.name}`}</div>
          {/* {session && (
            <button
              className="absolute z-10 m-2 bottom-0 right-0 w-6 h-6 bg-white/65 rounded-md"
              title="Reportar TP"
              aria-label="Reportar TP"
              onClick={() => {
                stateForm.setDataForm({
                  onSubmit: submitReportModule,
                  children: (
                    <>
                      <div className="flex flex-col *:flex *:gap-1">
                        <p>
                          <b>Nombre:</b>
                          {moduleInd.name}
                        </p>
                        <p>
                          <b>Subido por:</b>
                          {module.user.name}
                        </p>
                        {isTp ? (
                          <>
                            <p>
                              <b>Año:</b>
                              {moduleInd.year}
                            </p>
                            <p>
                              <b>Numero:</b>
                              {moduleInd.number || 'No tiene'}
                            </p>
                          </>
                        ) : (
                          <p>
                            <b>Fecha:</b>
                            {`${moduleInd.date.getMonth()}/${moduleInd.date.getFullYear()}`}
                          </p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm">Recuerda!</h3>
                        <p className="text-xs">
                          Por favor asegurate de que el examen que quieres reportar sea el correcto. En caso de cualquier problema podes contactarme:{' '}
                          <a className="underline" target="_blank" href="https://wa.me/+5492235319564">
                            2235319564
                          </a>
                        </p>
                      </div>
                      <HandlerInputs type="checkbox" id="check" name="check" placeholder="Confirmo mi reporte." required={true} />
                    </>
                  ),
                })
                stateModal.setDataModal({
                  title: `Reportar  ${isTp ? 'TP' : 'Examen'}`,
                  viewModal: true,
                })
              }}
            >
              <MdOutlineReport className="h-full w-full text-red-700" />
            </button>
          )} */}
          <PdfView id={moduleInd.id} url={isTp ? `tps/problemas` : `parciales/problemas`} />
        </div>
        <ul className="flex flex-col gap-1 pl-1">
          {problems.length == 0 ? (
            <li className="pl-3">
              <p>Sin respuestas :c</p>
            </li>
          ) : (
            <>
              {problems
                .map((problem, index) =>
                  problem.responses.length > 0 ? (
                    <ModuleResponse
                      key={((index + problem.responses.length) * (index + problem.responses.length + 1)) / 2 + index}
                      problem={problem}
                      typeModule={typeModule}
                      session={session}
                    />
                  ) : undefined
                )
                .filter((prob) => prob != undefined)}
            </>
          )}
        </ul>
      </div>
    </li>
  )
}
