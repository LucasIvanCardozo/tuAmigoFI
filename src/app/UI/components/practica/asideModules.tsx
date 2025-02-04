'use client';

import { useMainContext } from '@/app/lib/context';
import { DataModule, TypeValues } from '@/app/types';
import { courses } from '@prisma/client';
import { useEffect, useState } from 'react';
import { numberIconsTp } from '../../assets/icons';
import { CgClose, CgMenu } from 'react-icons/cg';
import { TbSquareAsteriskFilled, TbSquareMinusFilled } from 'react-icons/tb';
import { SiGoogledocs } from 'react-icons/si';
import { InputCustom } from './input';
import { createMidterm, createTp } from '@/app/lib/actions';

interface Params {
  typeModule: 'TP' | 'Parcial';
}

export const AsideModules = ({ typeModule }: Params) => {
  const {
    session,
    viewModule,
    setViewModule,
    dataModal,
    setDataModal,
    modules,
    setModules,
    course,
  } = useMainContext();
  const [asideState, setAsideState] = useState(false);
  const isTp = typeModule == 'TP';
  const handleViewModules = (module: number | null) => {
    setAsideState(false);
    setViewModule(module);
  };

  const submitAddModule = async (values: TypeValues[]) => {
    const name = values.find((val) => val.id == 'name');
    const year = values.find((val) => val.id == 'year');
    const number = values.find((val) => val.id == 'number');
    const date = values.find((val) => val.id == 'date');
    const file = values.find((val) => val.id == 'file');
    try {
      if (
        (isTp &&
          year &&
          number &&
          name &&
          file &&
          typeof name.value == 'string' &&
          file instanceof File &&
          typeof year.value == 'string' &&
          typeof number.value == 'string') ||
        (date &&
          name &&
          file &&
          typeof name.value == 'string' &&
          file instanceof File &&
          date instanceof Date)
      ) {
        if (session) {
          let module;
          if (isTp) {
            module = await createTp({
              name: name.value,
              number: Number(number?.value),
              year: Number(year?.value),
              idUser: session.user.id,
              idCourse: course.id,
            });
          } else {
            module = await createMidterm({
              name: name.value,
              date: date?.value as Date,
              idCourse: course.id,
              idUser: session.user.id,
            });
          }
          if (module) {
            const formData = new FormData();
            formData.set('file', file);
            formData.set('id', module.id.toString());
            formData.set(
              'subFolder',
              `${isTp ? 'tps' : 'parciales'}/problemas`
            );

            await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            try {
              setModules([
                ...modules,
                {
                  countReports: 0,
                  user: {
                    id: session.user.id,
                    email: session.user.email as string,
                    name: session.user.name as string,
                    banned: false,
                    tier: session.user.tier,
                    image: '',
                  },
                  problems: [],
                  module: module,
                },
              ]);
            } catch (error) {
              window.location.reload();
            }
          }
        }
      } else throw new Error('Faltan completar datos.');
    } catch (error) {}
  };

  useEffect(() => {
    if (asideState) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [asideState]);

  //no bloquear el scroll en pantallas escritorio
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)'); // Tailwind 'sm' breakpoint is 640px

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setAsideState(false);
      }
    };

    // Escucha los cambios de la media query
    mediaQuery.addEventListener('change', (e) => handleMediaChange(e));

    // Limpieza para remover el event listener
    return () => {
      mediaQuery.removeEventListener('change', (e) => handleMediaChange(e));
    };
  }, []);

  return (
    <>
      <button
        className="fixed top-0 left-0 m-1 h-8 bg-[--black-olive] rounded-md aspect-square rounded-e-none z-50 sm:hidden"
        aria-label="Abrir o cerrar menú"
        onClick={() => setAsideState(!asideState)}
        title="Menú"
      >
        <CgMenu
          className={
            (asideState ? 'opacity-0' : 'opacity-100') +
            ' transform-gpu transition-opacity absolute top-0 left-0 w-full h-full p-1'
          }
        />
        <CgClose
          className={
            (asideState ? 'opacity-100' : 'opacity-0') +
            ' transform-gpu transition-opacity absolute top-0 left-0 w-full h-full p-1'
          }
        />
        <div className="absolute h-8 left-full top-0 text-xl bg-[--black-olive] drop-shadow-sm rounded-md px-1 flex items-center justify-center rounded-s-none text-nowrap sm:hidden">
          {typeModule == 'TP' ? <b>Busca tu TP</b> : <b>Busca tu Parcial</b>}
        </div>
      </button>
      <aside
        className={
          (asideState ? 'translate-x-full' : 'translate-x-0') +
          ' fixed z-40 top-0 right-full  transform-gpu transition-transform bg-[--black-olive] w-max min-w-40  rounded-md mt-10 py-4 px-3 flex flex-col max-h-[80vh] gap-3 sm:max-h-none sm:relative sm:h-full sm:m-0 sm:max-w-52 sm:right-auto '
        }
      >
        <h1 className="text-xl hidden sm:block">
          <b>Busca tu TP</b>
        </h1>
        <ul
          className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          <li
            className={
              (!viewModule ? 'bg-[#3D4731]' : '') +
              ' grid grid-cols-[1.2rem,1fr] gap-1 p-1 rounded-md [&>svg]:self-start [&>svg]:h-max [&>svg]:w-full transform-gpu transition-transform sm:hover:scale-105'
            }
          >
            <TbSquareAsteriskFilled />
            <button
              className="text-start"
              onClick={() => handleViewModules(null)}
              aria-label="Mostrar todos"
              title="Mostrar todos los TPs"
            >
              <h2 className="text-base leading-4">Mostrar todos</h2>
              <p className="text-xs text-[--silver]">{`Todos los TPs`} </p>
            </button>
          </li>
          {modules.map(({ module }) => (
            <li
              key={module.id}
              className={
                (viewModule == module.id ? 'bg-[#3D4731] ' : '') +
                'grid grid-cols-[1.2rem,1fr] gap-1 p-1 rounded-md [&>svg]:self-start [&>svg]:h-max [&>svg]:w-full transform-gpu transition-transform sm:hover:scale-105'
              }
            >
              {'number' in module ? (
                module.number != undefined && numberIconsTp[module.number] ? (
                  numberIconsTp[module.number]
                ) : (
                  <TbSquareMinusFilled />
                )
              ) : (
                <SiGoogledocs />
              )}
              <button
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
                  <p className="text-xs text-[--silver]">
                    {`Del año ${module.year}`}{' '}
                  </p>
                ) : (
                  <p className="text-xs text-[--silver]">
                    {`Del ${
                      module.date.getMonth() + 1
                    }/${module.date.getFullYear()}`}{' '}
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
              className="text-start bg-[--white] py-1 px-2 rounded-md"
              onClick={() => {
                setDataModal({
                  dataForm: {
                    title: isTp ? 'Agregar TP' : 'Agregar Parcial',
                    children: (
                      <>
                        {isTp ? (
                          <>
                            <div className="flex flex-col">
                              <label htmlFor="name">Titulo</label>
                              <InputCustom
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Título del TP"
                                required={true}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label htmlFor="number">Número</label>
                              <InputCustom
                                id="number"
                                name="number"
                                type="number"
                                placeholder="Número del TP"
                                min={0}
                                max={30}
                                required={true}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label htmlFor="year">Año</label>
                              <InputCustom
                                id="year"
                                name="year"
                                type="number"
                                placeholder="Año del TP"
                                min={2000}
                                max={new Date().getFullYear()}
                                required={true}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col">
                              <label htmlFor="name">Título</label>
                              <InputCustom
                                type="select"
                                placeholder="Selecciona el tipo de parcial"
                                id="name"
                                name="name"
                                required={true}
                                children={
                                  <>
                                    <option value="Primer parcial">
                                      Primer parcial
                                    </option>
                                    <option value="Segundo parcial">
                                      Segundo parcial
                                    </option>
                                    <option value="Tercer Parcial">
                                      Tercer Parcial
                                    </option>
                                    <option value="Final">Final</option>
                                    <option value="Otros">Otros</option>
                                  </>
                                }
                              />
                            </div>
                            <div className="flex flex-col">
                              <label htmlFor="date">Fecha</label>
                              <InputCustom
                                type="date"
                                name="date"
                                id="date"
                                required={true}
                              />
                            </div>
                          </>
                        )}
                        <InputCustom
                          type="file"
                          id="file"
                          accept="application/pdf"
                          required={true}
                        />
                        <div>
                          <h3 className="text-sm">Recuerda!</h3>
                          <p className="text-xs">
                            Por favor asegurate de que el modulo que quieres
                            agregar no se encuentre ya disponible en la lista.
                            En caso de cualquier problema podes contactarme:{' '}
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
                    onSubmit: submitAddModule,
                  },
                  viewModal: true,
                });
              }}
              aria-label={isTp ? 'Agregar TP' : 'Agregar Parcial'}
              title={isTp ? 'Agregar TP' : 'Agregar Parcial'}
            >
              <p className="text-base text-[--black-olive] leading-4">
                {isTp ? 'Agregar TP' : 'Agregar Parcial'}
              </p>
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
};
