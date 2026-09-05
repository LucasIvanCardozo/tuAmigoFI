'use client';
import { useEffect, useState } from 'react';
import { SiGoogledocs } from 'react-icons/si';
import { TbSquareAsteriskFilled, TbSquareMinusFilled } from 'react-icons/tb';
import { numberIconsModules } from '@/app/assets/icons';
import { useModal } from '@/app/contexts/ModalContext';
import { useModuleSelection } from '@/app/contexts/ModuleSelectionContext';
import type { Course } from '@/app/lib/server/db/prisma/prismaClient/client';
import type { DataModule } from '@/app/types';
import { ModalAddMidtermContent } from '../../layout/modals/ModalAddMidtermContent';
import { ModalAddTpContent } from '../../layout/modals/ModalAddTpContent';
import { AsideMainButton } from './asideMainButton';

interface Props {
  modules: DataModule[];
  course: Course;
  typeModule: 'TP' | 'Practica';
}

export const AsideModules = ({ modules, course, typeModule }: Props) => {
  const [viewAside, setViewAside] = useState(false);
  const { openModal } = useModal();
  const { idModule, setIdModule } = useModuleSelection();
  const isTp = typeModule === 'TP';

  const handleOpenAddModal = () => {
    setViewAside(false);
    if (isTp) openModal(<ModalAddTpContent course={course} />);
    else openModal(<ModalAddMidtermContent course={course} />);
  };

  const handleViewModules = (module: string | null) => {
    setViewAside(false);
    setIdModule(module);
  };

  useEffect(() => {
    if (viewAside) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [viewAside]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setViewAside(false);
      }
    };
    mediaQuery.addEventListener('change', (e) => handleMediaChange(e));
    return () => {
      mediaQuery.removeEventListener('change', (e) => handleMediaChange(e));
    };
  }, []);

  return (
    <>
      <AsideMainButton viewAside={viewAside} onClick={() => setViewAside(!viewAside)} />
      <aside
        className={
          (viewAside ? 'translate-x-full' : 'translate-x-0') +
          ' fixed z-40 top-0 right-full  transform-gpu transition-transform bg-(--black-olive) w-max min-w-40  rounded-md mt-10 py-4 px-3 flex flex-col max-h-[80vh] gap-3 sm:max-h-none sm:relative sm:h-full sm:m-0 sm:max-w-52 sm:right-auto '
        }
      >
        <h1 className="text-xl hidden whitespace-nowrap sm:block">
          {isTp ? <b>Busca tu TP</b> : <b>Exámenes</b>}
        </h1>
        <ul
          className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          <li
            className={
              (!idModule ? 'bg-[#3D4731]' : '') +
              ' grid grid-cols-[1.2rem_1fr] gap-1 p-1 rounded-md [&>svg]:self-start [&>svg]:h-max [&>svg]:w-full transform-gpu transition-transform sm:hover:scale-105'
            }
          >
            <TbSquareAsteriskFilled />
            <button
              type="button"
              className="text-start"
              onClick={() => handleViewModules(null)}
              aria-label="Mostrar todos"
              title="Mostrar todos los TPs"
            >
              <h2 className="text-base leading-4">Mostrar todos</h2>
              <p className="text-xs text-(--silver)">{`Todos los TPs`} </p>
            </button>
          </li>
          {modules.map(({ module }) => (
            <li
              key={module.id}
              className={
                (idModule === module.id ? 'bg-[#3D4731] ' : '') +
                'grid grid-cols-[1.2rem_1fr] gap-1 p-1 rounded-md [&>svg]:self-start [&>svg]:h-max [&>svg]:w-full transform-gpu transition-transform sm:hover:scale-105'
              }
            >
              {'number' in module ? (
                typeof module.number === 'number' && numberIconsModules[module.number] ? (
                  numberIconsModules[module.number]
                ) : (
                  <TbSquareMinusFilled />
                )
              ) : (
                <SiGoogledocs />
              )}
              <button
                type="button"
                className="text-start"
                aria-label={
                  'number' in module
                    ? `Tp número ${module.number} con nombre ${module.name}`
                    : `${module.name} del ${module.date}`
                }
                title={`Mostrar module ${module.name}`}
                onClick={() => handleViewModules(module.id)}
              >
                <h2 className="text-base leading-4">{module.name}</h2>
                {'number' in module ? (
                  <p className="text-xs text-(--silver)">{`Del año ${module.year}`} </p>
                ) : (
                  <p className="text-xs text-(--silver)">
                    {`Del ${module.date.getMonth() + 1}/${module.date.getFullYear()}`}{' '}
                  </p>
                )}
              </button>
            </li>
          ))}
          <li
            className={
              'order-last gap-1 p-1 rounded-md transform-gpu text-center transition-transform sm:hover:scale-105'
            }
          >
            <button
              type="button"
              className="text-start bg-(--white) text-(--black-olive) py-1 px-2 rounded-md cursor-pointer"
              onClick={handleOpenAddModal}
            >
              {isTp ? (
                <p className="text-base leading-4">Agregar TP</p>
              ) : (
                <p className="text-base leading-4">Agregar Examen</p>
              )}
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
};
