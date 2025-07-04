'use client';
import { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import PdfView from '@/app/components/pdfView';
import {
  BiSolidRightArrowSquare,
  BiSolidLeftArrowSquare,
} from 'react-icons/bi';
import { FaCommentDots } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { DataModuleProblem, TypeValues } from '@/app/assets/types';
import { useMainContext } from '@/app/lib/contexts';
import ButtonReaction from './buttonReaction';
import { HandlerInputs } from '@/app/components/form/inputs/handlerInputs';
import { deleteMidtermResponse, deleteTpResponse } from '@/app/lib/actions';
import { Code } from './Code';
import { CommentsLi } from './commentsLi';
import { CgMathPlus } from 'react-icons/cg';

export default function ModuleResponse({
  problem,
}: {
  problem: DataModuleProblem;
}) {
  const [responses, setResponses] = useState(problem.responses);
  const [indexResponse, setIndexResponse] = useState<number>(0);
  const [stateComment, setStateComment] = useState(false);
  const [viewResponses, setViewResponses] = useState(false);

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

  const handleComment = () => {
    setStateComment(!stateComment);
    console.log(responses[indexResponse].comments);
  };

  return (
    <li className="mx-2 my-1">
      {viewResponses ? (
        <>
          <div className="relative bg-[--white] text-base leading-5 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.5)] flex flex-col min-h-32">
            <span className="bg-[#C8E0E4] flex justify-between items-center">
              <b className="bg-[#9fc8cf] p-1">{`Ejercicio ${problem.number}:`}</b>
              <span className="opacity-75 p-1 flex gap-1">
                Por {`${responses[indexResponse].user.name}`}
                <button onClick={() => setViewResponses(!viewResponses)}>
                  <CgMathPlus className="text-xl " />
                </button>
              </span>
            </span>
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
                              quieres eliminar. Se borrara esta misma con todas
                              sus reacciones. En caso de cualquier problema
                              podés contactarme:{' '}
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
            {
              // 0 -> texto ; 1 -> imagen ; 2 -> pdf ; 3 -> codigo
              responses[indexResponse].response.type == 0 ? (
                <div className="whitespace-pre px-2 pb-7">
                  <p>{responses[indexResponse].response.text}</p>
                </div>
              ) : responses[indexResponse].response.type == 1 ? (
                <div className="relative flex justify-center w-full max-h-250 pb-7">
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
                <div className="relative overflow-hidden bg-[#C8E0E4] h-min max-w-full py-1 pb-7 rounded-md sm:p-1">
                  <PdfView
                    id={responses[indexResponse].response.id_user}
                    url={`${isTp ? 'tps' : 'parciales'}/respuestas/${
                      responses[indexResponse].response.id_module
                    }/${responses[indexResponse].response.number}`}
                  />
                </div>
              ) : responses[indexResponse].response.type == 3 ? (
                <div className="bg-gray-900 p-3 text-white rounded-md overflow-x-auto pb-7">
                  <Code code={responses[indexResponse].response.text ?? ''} />
                </div>
              ) : null
            }
            <div className="flex absolute bottom-0 right-0 z-10 gap-1 p-1 bg-[--white] rounded-md select-none">
              <ButtonReaction
                indexResponse={indexResponse}
                responses={responses}
                setResponses={setResponses}
              />
              |
              <button onClick={handleComment}>
                <FaCommentDots className="text-xl" />
              </button>
              {responses[indexResponse].comments.length}
            </div>
          </div>
          {stateComment && (
            // <CommentsLi
            //   comments={[
            //     {
            //       comment: {
            //         id: 1,
            //         id_response: 1,
            //         text: 'comentario 1',
            //         id_user: 1,
            //         created_at: new Date(),
            //       },
            //       reactions: [],
            //       users: {
            //         id: 1,
            //         name: 'Lucas',
            //         email: '@gmail',
            //         banned: false,
            //         created_at: null,
            //         image: '',
            //         tier: 2,
            //       },
            //     },
            //     {
            //       comment: {
            //         id: 2,
            //         id_response: 1,
            //         text: 'comentario 2',
            //         id_user: 1,
            //         created_at: new Date(),
            //       },
            //       reactions: [],
            //       users: {
            //         id: 1,
            //         name: 'Lucas',
            //         email: '@gmail',
            //         banned: false,
            //         created_at: null,
            //         image: '',
            //         tier: 2,
            //       },
            //     },
            //   ]}
            // />
            <CommentsLi comments={responses[indexResponse].comments} />
          )}
        </>
      ) : (
        <div className="relative bg-[--white] text-base leading-5 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.5)] flex flex-col">
          <span className="bg-[#C8E0E4] flex justify-between items-center">
            <b className=" p-1">{`Ejercicio ${problem.number}`}</b>
            <span className="opacity-75 p-1 flex gap-1">
              {`Hay ${responses.length} respuesta disponible`}
              <button onClick={() => setViewResponses(!viewResponses)}>
                <CgMathPlus className="text-xl " />
              </button>
            </span>
          </span>
        </div>
      )}
    </li>
  );
}
