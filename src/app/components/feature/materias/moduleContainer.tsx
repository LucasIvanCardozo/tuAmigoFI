'use client';
import { useSession } from 'next-auth/react';
import { CgMathPlus } from 'react-icons/cg';
import { MdDelete } from 'react-icons/md';
import { SiGoogledocs } from 'react-icons/si';
import PdfView from '@/app/components/pdfView';
import { useModal } from '@/app/contexts/ModalContext';
import { useModuleSelection } from '@/app/contexts/ModuleSelectionContext';
import type { DataModule } from '@/app/types';
import { numberIconsModules } from '../../../assets/icons';
import { ModalAddResponseContent } from '../../layout/modals/ModalAddResponseContent';
import { ModalDeleteMidtermContent } from '../../layout/modals/ModalDeleteMidtermContent';
import { ModalDeleteTpContent } from '../../layout/modals/ModalDeleteTpContent';
import ModuleResponse from './moduleResponse';

interface Props {
  module: DataModule;
  typeModule: 'TP' | 'Practica';
}

export const ModuleContainer = ({ module, typeModule }: Props) => {
  const { data: session } = useSession();
  const { openModal } = useModal();
  const { idModule } = useModuleSelection();
  const moduleInd = module.module;
  const problems = module.problems;
  const isTp = 'number' in moduleInd;

  return (
    <li className={`relative ${idModule != null && idModule !== moduleInd.id && 'hidden'}`}>
      <div className="flex items-center text-xl sticky top-0 z-20 bg-(--platinum) py-1 ">
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
            <p className="inline-block text-base">{`(${moduleInd.date.getMonth() + 1}/${moduleInd.date.getFullYear()})`}</p>
          )}
        </h2>

        <div className="flex gap-1 px-1 ml-auto">
          {session &&
            (session.user?.tier === 2 || session.user?.id === module.user.id) &&
            (isTp ? (
              <button
                type="button"
                title="Eliminar TP"
                aria-label="Eliminar TP"
                onClick={() =>
                  openModal(
                    <ModalDeleteTpContent tp={moduleInd} user={module.user} session={session} />,
                  )
                }
              >
                <MdDelete />
              </button>
            ) : (
              <button
                type="button"
                title="Eliminar Examen"
                aria-label="Eliminar Examen"
                onClick={() =>
                  openModal(
                    <ModalDeleteMidtermContent
                      midterm={moduleInd}
                      user={module.user}
                      session={session}
                    />,
                  )
                }
              >
                <MdDelete />
              </button>
            ))}

          <button
            type="button"
            className="flex text-base h-6 pr-1 items-center border-2 border-gray-600 rounded-md hover:bg-[#92C1C9] transition-colors hover:border-[#92C1C9]"
            title="Añadir una respuesta"
            aria-label="Añadir una respuesta"
            onClick={() =>
              openModal(<ModalAddResponseContent module={moduleInd} session={session} />)
            }
          >
            <CgMathPlus />
            <span>Respuesta</span>
          </button>
        </div>
      </div>
      <div className="bg-(--white) text-base leading-5 drop-shadow-md flex flex-col gap-1">
        <div className="relative overflow-hidden bg-[#96cad3] h-min rounded-b-lg p-1 sm:p-2">
          <div className="absolute z-10 bg-(--white) rounded-md m-2 opacity-65 top-0 left-0">{`Por ${module.user.name}`}</div>
          <PdfView url={moduleInd.fileUrl ?? ''} />
        </div>
        <ul className="flex flex-col gap-1 pl-1">
          {problems.length === 0 ? (
            <li className="pl-3">
              <p>Sin respuestas :c</p>
            </li>
          ) : (
            problems
              .map((problem) =>
                problem.responses.length > 0 ? (
                  <ModuleResponse
                    key={problem.number}
                    problem={problem}
                    typeModule={typeModule}
                    session={session}
                  />
                ) : undefined,
              )
              .filter((prob) => prob !== undefined)
          )}
        </ul>
      </div>
    </li>
  );
};
