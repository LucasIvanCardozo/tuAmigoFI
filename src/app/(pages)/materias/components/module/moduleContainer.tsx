'use client';
import { numberIconsModules } from '../../assets/icons';
import { CgMathPlus } from 'react-icons/cg';
import { MdDelete } from 'react-icons/md';
import { MdOutlineReport } from 'react-icons/md';
import PdfView from '@/app/components/pdfView';
import {
  DataModule,
  DataModuleProblem,
  DataModuleResponse,
  TypeValues,
} from '@/app/assets/types';
import { useMainContext } from '@/app/lib/contexts';
import { SiGoogledocs } from 'react-icons/si';
import ModuleResponse from '../responses/moduleResponse';
import { HandlerInputs } from '@/app/components/form/inputs/handlerInputs';
import {
  addReportMidterm,
  addReportTp,
  createResponseMidterm,
  createResponseTp,
  deleteMidterm,
  deleteTP,
} from '@/app/lib/actions';

interface Params {
  module: DataModule;
}

export const ModuleContainer = ({ module }: Params) => {
  
  const { session, stateViewModule, stateModal, stateModules, stateForm } =
    useMainContext();

  const user = module.user;
  const moduleInd = module.module;
  const problems = module.problems;
  const isTp = 'number' in moduleInd;

  const submitDeleteModule = async (values: TypeValues[]) => {
    const check = values.find((val) => val.id == 'check');
    try {
      if (check && typeof check.value === 'boolean') {
        if (session && session?.user?.tier == 2) {
          const formData = new FormData();
          formData.set('id', moduleInd.id.toString());
          formData.set(
            'subFolder',
            `${isTp ? 'tps' : 'parciales'}/respuestas/${moduleInd.id}`
          );
          const res = await fetch('/api/destroyAll', {
            method: 'POST',
            body: formData,
          });

          formData.set('id', moduleInd.id.toString());
          formData.set('subFolder', `${isTp ? 'tps' : 'parciales'}/problemas`);

          const res2 = await fetch('/api/destroy', {
            method: 'POST',
            body: formData,
          });

          if (res.ok && res2.ok) {
            if (isTp) await deleteTP({ id: moduleInd.id });
            else await deleteMidterm({ id: moduleInd.id });
            try {
              stateModules.setModules(
                stateModules.modules.filter(
                  (mod) => mod.module.id != module.module.id
                )
              );
            } catch (error) {
              window.location.reload();
            }
          } else throw new Error('Error al eliminar esta respuesta');
        }
      } else throw new Error('Faltan completar datos.');
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error('Error inesperado.');
    }
  };

  const submitReportModule = async (values: TypeValues[]) => {
    const check = values.find((val) => val.id == 'check');
    try {
      if (check && typeof check.value === 'boolean') {
        if (session) {
          if (isTp) {
            await addReportTp({
              id_tp: moduleInd.id,
              id_user: session.user.id,
            });
          } else {
            await addReportMidterm({
              id_midterm: moduleInd.id,
              id_user: session.user.id,
            });
          }
        }
      } else throw new Error('Faltan completar datos.');
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error('Error inesperado.');
    }
  };

  const submitAddResponse = async (values: TypeValues[]) => {
    const number = values.find((val) => val.id == 'number');
    const selectResponse = values.find((val) => val.id == 'selectResponse');
    try {
      if (
        number &&
        typeof number.value === 'string' &&
        selectResponse &&
        (((selectResponse.inputType == '0' ||
          selectResponse.inputType == '3') &&
          typeof selectResponse.value == 'string') ||
          ((selectResponse.inputType == '1' ||
            selectResponse.inputType == '2') &&
            selectResponse.value instanceof File))
      ) {
        if (session) {
          let addResponse;
          const typeResponse = Number(selectResponse.inputType);
          if (isTp) {
            addResponse = await createResponseTp({
              idUser: session.user.id,
              idTp: moduleInd.id,
              number: Number(number.value),
              text:
                selectResponse.inputType == '0' ||
                selectResponse.inputType == '3'
                  ? (selectResponse.value as string)
                  : undefined,
              type: typeResponse,
            });
          } else {
            addResponse = await createResponseMidterm({
              idUser: session.user.id,
              idMidterm: moduleInd.id,
              number: Number(number.value),
              text:
                selectResponse.inputType == '0' ||
                selectResponse.inputType == '3'
                  ? (selectResponse.value as string)
                  : undefined,
              type: typeResponse,
            });
          }
          if (typeResponse == 1 || typeResponse == 2) {
            if (selectResponse.value) {
              if (addResponse) {
                const formData = new FormData();
                formData.set('file', selectResponse.value);
                formData.set('id', session.user.id.toString());
                formData.set(
                  'subFolder',
                  `${isTp ? 'tps' : 'parciales'}/respuestas/${
                    moduleInd.id
                  }/${Number(number.value)}`
                );
                await fetch('/api/upload', {
                  method: 'POST',
                  body: formData,
                });
              } else {
                throw new Error('Ocurrio un error en la suba de la respuesta');
              }
            } else throw new Error('No se encontro ningun archivo');
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
                created_at: new Date(),
              },
              response: addResponse,
              reactions: [],
              comments: [],
            };
            stateModules.setModules(
              stateModules.modules.map((mod) => {
                let newProblems: DataModuleProblem[];
                if (
                  mod.problems.some((pro) => pro.number == addResponse.number)
                ) {
                  newProblems = mod.problems.map((pro) =>
                    pro.number == addResponse.number
                      ? {
                          ...pro,
                          responses: [...pro.responses, responseAux],
                        }
                      : pro
                  );
                } else {
                  newProblems = [
                    ...mod.problems,
                    { number: addResponse.number, responses: [responseAux] },
                  ];
                }
                return mod.module.id == module.module.id
                  ? { ...mod, problems: newProblems }
                  : mod;
              })
            );
          } catch (error) {
            window.location.reload();
          }
        } else throw new Error('Debes iniciar sesion.');
      } else throw new Error('Faltan completar datos.');
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error('Error inesperado.');
    }
  };

  return (
    <li
      className={
        'relative ' +
        `${
          stateViewModule.viewModule != null &&
          stateViewModule.viewModule != moduleInd.id &&
          'hidden'
        }`
      }
    >
      <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1 ">
        {isTp ? (
          moduleInd.number && numberIconsModules[moduleInd.number] ? (
            numberIconsModules[moduleInd.number]
          ) : (
            numberIconsModules[0]
          )
        ) : (
          <SiGoogledocs />
        )}
        <h2>
          {moduleInd.name}{' '}
          {isTp ? (
            <p className="inline-block text-base">{`(${moduleInd.year})`}</p>
          ) : (
            <p className="inline-block text-base">{`(${
              moduleInd.date.getMonth() + 1
            }/${moduleInd.date.getFullYear()})`}</p>
          )}
        </h2>

        <div className="flex gap-1 px-1 ml-auto [&>*]:aspect-square">
          {session && session.user.tier == 2 && (
            <button
              title={`Eliminar ${isTp ? 'TP' : 'Examen'}`}
              aria-label={`Eliminar ${isTp ? 'TP' : 'Examen'}`}
              onClick={() => {
                stateModal.setDataModal({
                  title: `Eliminar ${isTp ? 'TP' : 'Examen'}`,
                  viewModal: true,
                });
                stateForm.setDataForm({
                  onSubmit: submitDeleteModule,
                  children: (
                    <>
                      <div className="flex flex-col [&>*]:flex [&>*]:gap-1">
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
                            {`${
                              moduleInd.date.getMonth() + 1
                            }/${moduleInd.date.getFullYear()}`}
                          </p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm">Recuerda!</h3>
                        <p className="text-xs">
                          Por favor asegurate de que el examen que quieres
                          eliminar sea el correcto. Se eliminaran todos los
                          problemas, las respuestas y sus reacciones. En caso de
                          cualquier problema podes contactarme:{' '}
                          <a
                            className="underline"
                            target="_blank"
                            href="https://wa.me/+5492235319564"
                          >
                            2235319564
                          </a>
                        </p>
                      </div>
                      <HandlerInputs
                        type="checkbox"
                        id="check"
                        name="check"
                        placeholder="Confirmo la eliminación."
                        required={true}
                      />
                    </>
                  ),
                });
              }}
            >
              <MdDelete />
            </button>
          )}

          <button
            className="flex text-base h-6 pr-1 items-center border-2 border-gray-600 rounded-md hover:bg-[#92C1C9] transition-colors hover:border-[#92C1C9]"
            title="Añadir una respuesta"
            aria-label="Añadir una respuesta"
            onClick={() =>
              session
                ? (stateForm.setDataForm({
                    onSubmit: submitAddResponse,
                    children: (
                      <>
                        <div className="flex flex-col">
                          <label htmlFor="number">Número</label>
                          <HandlerInputs
                            type="number"
                            id="number"
                            name="number"
                            min={0}
                            max={100}
                            placeholder="Número del problema"
                            required={true}
                          />
                        </div>
                        <HandlerInputs
                          type="selectResponse"
                          id="selectResponse"
                          required={true}
                          name="selectResponse"
                        />
                        <div>
                          <p>
                            Esta respuesta se añadirá al módulo "
                            {moduleInd.name}"
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm">Recuerda!</h3>
                          <p className="text-xs">
                            Por favor asegurate de que las respuestas estén
                            legibles y sean para este módulo. En caso de
                            cualquier problema podes contactarme:{' '}
                            <a
                              className="underline"
                              target="_blank"
                              href="https://wa.me/+5492235319564"
                            >
                              2235319564
                            </a>
                          </p>
                        </div>
                      </>
                    ),
                  }),
                  stateModal.setDataModal({
                    title: 'Añadir una respuesta',
                    viewModal: true,
                  }))
                : window.alert('Debes iniciar sesion para subir una respuesta.')
            }
          >
            <CgMathPlus />
            <span>Respuesta</span>
          </button>
        </div>
      </div>
      <div className="bg-[--white] text-base leading-5 drop-shadow-md flex flex-col gap-1">
        <div className="relative overflow-hidden bg-[#96cad3] h-min rounded-b-lg p-1 sm:p-2">
          <div className="absolute z-10 bg-[--white] rounded-md m-2 opacity-65 top-0 left-0">{`Por ${user.name}`}</div>
          {session && (
            <button
              className="absolute z-10 m-2 bottom-0 right-0 w-6 h-6 bg-white bg-opacity-65 rounded-md"
              title="Reportar TP"
              aria-label="Reportar TP"
              onClick={() => {
                stateForm.setDataForm({
                  onSubmit: submitReportModule,
                  children: (
                    <>
                      <div className="flex flex-col [&>*]:flex [&>*]:gap-1">
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
                          Por favor asegurate de que el examen que quieres
                          reportar sea el correcto. En caso de cualquier
                          problema podes contactarme:{' '}
                          <a
                            className="underline"
                            target="_blank"
                            href="https://wa.me/+5492235319564"
                          >
                            2235319564
                          </a>
                        </p>
                      </div>
                      <HandlerInputs
                        type="checkbox"
                        id="check"
                        name="check"
                        placeholder="Confirmo mi reporte."
                        required={true}
                      />
                    </>
                  ),
                });
                stateModal.setDataModal({
                  title: `Reportar  ${isTp ? 'TP' : 'Examen'}`,
                  viewModal: true,
                });
              }}
            >
              <MdOutlineReport className="h-full w-full text-red-700" />
            </button>
          )}
          <PdfView
            id={moduleInd.id}
            url={isTp ? `tps/problemas` : `parciales/problemas`}
          />
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
                      key={
                        ((index + problem.responses.length) *
                          (index + problem.responses.length + 1)) /
                          2 +
                        index
                      }
                      problem={problem}
                    />
                  ) : undefined
                )
                .filter((prob) => prob != undefined)}
            </>
          )}
        </ul>
      </div>
    </li>
  );
};
