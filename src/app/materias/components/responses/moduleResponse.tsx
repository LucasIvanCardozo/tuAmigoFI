'use client';
import { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import 'katex/dist/katex.min.css';
import PdfView from '@/app/components/pdfView';
import {
  BiSolidRightArrowSquare,
  BiSolidLeftArrowSquare,
} from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { DataModuleProblem, TypeValues } from '@/app/assets/types';
import { useMainContext } from '@/app/lib/contexts';
import ButtonReaction from './buttonReaction';
import { HandlerInputs } from '@/app/components/form/inputs/handlerInputs';
import { deleteMidtermResponse, deleteTpResponse } from '@/app/lib/actions';

export default function ModuleResponse({
  problem,
}: {
  problem: DataModuleProblem;
}) {
  const [responses, setResponses] = useState(problem.responses);
  const [indexResponse, setIndexResponse] = useState<number>(0);

  const { session, stateModal, stateModules, stateForm } = useMainContext();

  const isTp = 'number' in stateModules.modules[0].module;

  const handlePageUser = (add: number) => {
    const suma = indexResponse + add;
    if (!(suma >= problem.responses.length || suma < 0)) {
      setIndexResponse(suma);
    }
  };

  const submitDeleteResponse = async (values: TypeValues[]) => {
    const check = values.find((val) => val.id == 'check');
    try {
      if (check && typeof check.value === 'boolean') {
        if (session && session?.user?.tier == 2) {
          const deleteModuleDB = async () => {
            if (isTp) {
              await deleteTpResponse({
                id: responses[indexResponse].response.id,
              });
            } else if (!isTp) {
              await deleteMidtermResponse({
                id: responses[indexResponse].response.id,
              });
            }
            try {
              const indexResponseAux = indexResponse;
              setIndexResponse((indexResponse) => 0);
              stateModules.setModules(
                stateModules.modules.map((mod) =>
                  mod.module.id ==
                  responses[indexResponseAux].response.id_module
                    ? {
                        ...mod,
                        problems: mod.problems.map((pro) =>
                          pro.number == problem.number
                            ? {
                                ...pro,
                                responses: pro.responses.filter(
                                  (res) =>
                                    res.response.id !=
                                    responses[indexResponseAux].response.id
                                ),
                              }
                            : pro
                        ),
                      }
                    : mod
                )
              );
            } catch (error) {
              window.location.reload();
            }
          };
          if (
            responses[indexResponse].response.type == 1 ||
            responses[indexResponse].response.type == 2
          ) {
            const formData = new FormData();
            formData.set(
              'id',
              responses[indexResponse].response.id_user.toString()
            );
            formData.set(
              'subFolder',
              `${isTp ? 'tps' : 'parciales'}/respuestas/${
                responses[indexResponse].response.id_module
              }/${responses[indexResponse].response.number}`
            );
            const res = await fetch('/api/destroy', {
              method: 'POST',
              body: formData,
            });
            if (res.ok) {
              deleteModuleDB();
            } else throw new Error('Error al eliminar respuesta');
          } else {
            deleteModuleDB();
          }
        }
      } else {
        throw new Error('Faltan completar datos.');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <li className="relative bg-[--white] p-1 text-base leading-5 shadow-md flex flex-col min-h-32">
      <div>
        <p className="bg-[#C8E0E4] p-1 rounded-md flex justify-between">
          <b className="bg-[#92C1C9] rounded-sm">{`Respuesta ${problem.number}:`}</b>
          <br />
          <span className="opacity-75">
            Por {`${responses[indexResponse].user.name}`}
          </span>
        </p>

        <div className="w-full h-5 relative flex justify-between">
          {session?.user.tier == 2 && (
            <button
              aria-label="Eliminar respuesta"
              title="Eliminar respuesta"
              onClick={() => {
                stateForm.setDataForm({
                  onSubmit: submitDeleteResponse,
                  children: (
                    <>
                      <div>
                        <div className="flex flex-col [&>*]:flex [&>*]:gap-1">
                          <p>
                            <b>Numero del problema:</b>
                            {responses[indexResponse].response.number}
                          </p>
                          <p>
                            <b>Subida por:</b>
                            {responses[indexResponse].user.name}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm">Recuerda!</h3>
                        <p className="text-xs">
                          Por favor asegurate de que la respuesta sea la que
                          quieres eliminar. Se borrara esta misma con todas sus
                          reacciones. En caso de cualquier problema podés
                          contactarme:{' '}
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
                stateModal.setDataModal({
                  title: 'Eliminar respuesta',
                  viewModal: true,
                });
              }}
            >
              <MdDelete className="h-full w-full" />
            </button>
          )}
          <span></span>
          <div className="flex gap-1">
            <button
              className="h-full aspect-square text-[--black-olive] opacity-90"
              aria-label="Cambiar usuario que respondió hacia la izquierda"
              title="Cambiar hacia izquierda"
              onClick={() => handlePageUser(-1)}
            >
              <BiSolidLeftArrowSquare className="h-full w-full" />
            </button>
            {`${indexResponse + 1} de ${responses.length}`}
            <button
              className="h-full aspect-square text-[--black-olive] opacity-90"
              aria-label="Cambiar usuario que respondió hacia la derecha"
              title="Cambiar hacia derecha"
              onClick={() => handlePageUser(1)}
            >
              <BiSolidRightArrowSquare className="h-full w-full" />
            </button>
          </div>
        </div>
      </div>
      {
        // 0 -> texto ; 1 -> imagen ; 2 -> pdf ; 3 -> codigo
        responses[indexResponse].response.type == 0 ? (
          <div className="text-balance">
            <p>{responses[indexResponse].response.text}</p>
          </div>
        ) : responses[indexResponse].response.type == 1 ? (
          <div className="relative flex justify-center w-full max-h-250">
            <CldImage
              src={`https://res.cloudinary.com/donzj5rlf/image/upload/f_auto,q_auto/v${Math.floor(
                Date.now() / (1000 * 60 * 60 * 24 * 7)
              )}/${isTp ? 'tps' : 'parciales'}/respuestas/${
                responses[indexResponse].response.id_module
              }/${responses[indexResponse].response.number}/${
                responses[indexResponse].response.id_user
              }`}
              alt=""
              width="500"
              height="500"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        ) : responses[indexResponse].response.type == 2 ? (
          <div className="relative overflow-hidden bg-[#C8E0E4] h-min max-w-full py-1 rounded-md sm:p-1">
            <PdfView
              id={responses[indexResponse].response.id_user}
              url={`${isTp ? 'tps' : 'parciales'}/respuestas/${
                responses[indexResponse].response.id_module
              }/${responses[indexResponse].response.number}`}
            />
          </div>
        ) : responses[indexResponse].response.type == 3 ? (
          <div className="whitespace-pre-wrap">
            <p>{responses[indexResponse].response.text}</p>
          </div>
        ) : null
      }
      <ButtonReaction
        indexResponse={indexResponse}
        responses={responses}
        setResponses={setResponses}
      />
    </li>
  );
}
