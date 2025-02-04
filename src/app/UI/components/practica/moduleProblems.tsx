'use client';
import {
  TbSquareRoundedNumber0Filled,
  TbSquareRoundedNumber1Filled,
  TbSquareRoundedNumber2Filled,
  TbSquareRoundedNumber3Filled,
  TbSquareRoundedNumber4Filled,
  TbSquareRoundedNumber5Filled,
  TbSquareRoundedNumber6Filled,
  TbSquareRoundedNumber7Filled,
  TbSquareRoundedNumber8Filled,
  TbSquareRoundedNumber9Filled,
} from 'react-icons/tb';
import { tps_responses, tps, users } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { MdOutlineAddBox } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { MdOutlineReport } from 'react-icons/md';
import PdfView from '../pdfView';
// import ResponseTp from './responseTp';
import {
  DataModule,
  DataModuleProblem,
  TypeModule,
  TypeModuleResponses,
  TypeValues,
} from '@/app/types';
import { useMainContext } from '@/app/lib/context';
import { SiGoogledocs } from 'react-icons/si';
import ModuleResponse from './moduleResponse';
import { InputCustom } from './input';
import {
  addReportMidterm,
  addReportTp,
  createResponseMidterm,
  createResponseTp,
  deleteMidterm,
  deleteTP,
} from '@/app/lib/actions';
import {
  fetchMidterms,
  fetchResponsesMidterm,
  fetchResponsesTp,
  fetchTps,
  fetchUser,
  fetchUserReactionMidterm,
  fetchUserReactionTp,
} from '@/app/lib/data';
import { useEffect } from 'react';

interface Params {
  module: DataModule;
}

export const ModuleProblems = ({ module }: Params) => {
  const numberIcons = [
    <TbSquareRoundedNumber0Filled />,
    <TbSquareRoundedNumber1Filled />,
    <TbSquareRoundedNumber2Filled />,
    <TbSquareRoundedNumber3Filled />,
    <TbSquareRoundedNumber4Filled />,
    <TbSquareRoundedNumber5Filled />,
    <TbSquareRoundedNumber6Filled />,
    <TbSquareRoundedNumber7Filled />,
    <TbSquareRoundedNumber8Filled />,
    <TbSquareRoundedNumber9Filled />,
  ];
  const { session, viewModule, setDataModal, modules, setModules, course } =
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
              setModules(
                modules.filter((mod) => mod.module.id != module.module.id)
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
                  }/${number}`
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
        }
        try {
          const newResponses = isTp
            ? await fetchResponsesTp(moduleInd.id)
            : await fetchResponsesMidterm(moduleInd.id);
          let newProblems: DataModuleProblem[] = [];
          let numAux: number = newResponses[0]?.number;
          let i = 0;

          if (newResponses[0])
            newProblems.push({ number: newResponses[i].number, responses: [] });

          for (const response of newResponses) {
            const user = await fetchUser(response.id_user);
            const reactions = isTp
              ? await fetchUserReactionTp(response.id)
              : await fetchUserReactionMidterm(response.id);
            if (numAux != response.number) {
              newProblems.push({ number: response.number, responses: [] });
              numAux = response.number;
              i++;
            }
            newProblems[i].responses.push({
              response: response,
              user: user,
              reactions: reactions,
            });
          }
          setModules(
            modules.map((mod) =>
              mod.module.id == module.module.id
                ? { ...mod, problems: newProblems }
                : mod
            )
          );
        } catch (error) {
          window.location.reload();
        }
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
        `${viewModule != null && viewModule != moduleInd.id && 'hidden'}`
      }
    >
      <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1 ">
        {isTp ? (
          moduleInd.number && numberIcons[moduleInd.number] ? (
            numberIcons[moduleInd.number]
          ) : (
            numberIcons[0]
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
              title={`Eliminar ${isTp ? 'TP' : 'Parcial'}`}
              aria-label={`Eliminar ${isTp ? 'TP' : 'Parcial'}`}
              onClick={() =>
                setDataModal({
                  dataForm: {
                    title: `Eliminar ${isTp ? 'TP' : 'Parcial'}`,
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
                            Por favor asegurate de que el modulo que quieres
                            eliminar sea el correcto. Se eliminaran todos los
                            problemas, las respuestas y sus reacciones. En caso
                            de cualquier problema podes contactarme:{' '}
                            <a
                              className="underline"
                              target="_blank"
                              href="https://wa.me/+5492235319564"
                            >
                              2235319564
                            </a>
                          </p>
                        </div>
                        <InputCustom
                          type="checkbox"
                          id="check"
                          name="check"
                          placeholder="Confirmo la eliminación."
                          required={true}
                        />
                      </>
                    ),
                    onSubmit: submitDeleteModule,
                  },
                  viewModal: true,
                })
              }
            >
              <MdDelete />
            </button>
          )}

          <button
            title="Añadir una respuesta"
            aria-label="Añadir una respuesta"
            onClick={() =>
              session
                ? setDataModal({
                    dataForm: {
                      title: 'Añadir una respuesta',
                      children: (
                        <>
                          <div className="flex flex-col">
                            <label htmlFor="number">Número</label>
                            <InputCustom
                              type="number"
                              id="number"
                              name="number"
                              min={0}
                              max={100}
                              placeholder="Número del problema"
                              required={true}
                            />
                          </div>
                          <InputCustom
                            type="selectResponse"
                            id="selectResponse"
                            required={true}
                            name="selectResponse"
                          />
                          <div>
                            <p>
                              Esta respuesta se añadirá al modulo{' '}
                              {moduleInd.name}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm">Recuerda!</h3>
                            <p className="text-xs">
                              Por favor asegurate de que las respuestas estén
                              legibles y sean para este modulo. En caso de
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
                      onSubmit: submitAddResponse,
                    },
                    viewModal: true,
                  })
                : window.alert('Debes iniciar sesion para subir una respuesta.')
            }
          >
            <MdOutlineAddBox />
          </button>
        </div>
      </div>
      <div className="bg-[--white] p-2 text-base leading-5 drop-shadow-md flex flex-col gap-1">
        <div className="relative overflow-hidden bg-[#C8E0E4] h-min py-1 rounded-md sm:p-1">
          <div className="absolute z-10 bg-[--white] rounded-md m-2 opacity-65 top-0 left-0">{`Por ${user.name}`}</div>
          {session && (
            <button
              className="absolute z-10 m-2 bottom-0 right-0 w-6 h-6"
              title="Reportar TP"
              aria-label="Reportar TP"
              onClick={() =>
                setDataModal({
                  dataForm: {
                    title: `Reportar  ${isTp ? 'TP' : 'Parcial'}`,
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
                            Por favor asegurate de que el modulo que quieres
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
                        <InputCustom
                          type="checkbox"
                          id="check"
                          name="check"
                          placeholder="Confirmo mi reporte."
                          required={true}
                        />
                      </>
                    ),
                    onSubmit: submitReportModule,
                  },
                  viewModal: true,
                })
              }
            >
              <MdOutlineReport className="h-full w-full text-red-700" />
            </button>
          )}
          <PdfView id={moduleInd.id} url="tps/problemas" />
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
