'use client';

import { AsideContext, useMainContext } from '@/app/lib/contexts';
import { TypeValues } from '@/app/assets/types';
import { useEffect, useState } from 'react';
import { numberIconsModules } from '../../assets/icons';
import { TbSquareAsteriskFilled, TbSquareMinusFilled } from 'react-icons/tb';
import { SiGoogledocs } from 'react-icons/si';
import { HandlerInputs } from '@/app/components/form/inputs/handlerInputs';
import { createMidterm, createTp } from '@/app/lib/actions';
import { AsideMainButton } from './asideMainButton';

export const AsideModules = () => {
  const {
    session,
    stateViewModule,
    stateModules,
    stateModal,
    stateForm,
    course,
    typeModule,
  } = useMainContext();
  const [viewAside, setViewAside] = useState(false);
  const isTp = typeModule == 'TP';

  const handleViewModules = (module: number | null) => {
    setViewAside(false);
    stateViewModule.setViewModule(module);
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
          file.value instanceof File &&
          typeof year.value == 'string' &&
          typeof number.value == 'string') ||
        (date &&
          name &&
          file &&
          typeof name.value == 'string' &&
          file.value instanceof File &&
          date.value instanceof Date)
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
            formData.set('file', file.value);
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
              stateModules.setModules([
                ...stateModules.modules,
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
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error('Error inesperado.');
    }
  };

  useEffect(() => {
    if (viewAside) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [viewAside]);

  //no bloquear el scroll en pantallas escritorio
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)'); // Tailwind 'sm' breakpoint is 640px

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setViewAside(false);
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
    <AsideContext.Provider value={{ stateAside: { viewAside, setViewAside } }}>
      <AsideMainButton onClick={() => setViewAside(!viewAside)} />
      <aside
        className={
          (viewAside ? 'translate-x-full' : 'translate-x-0') +
          ' fixed z-40 top-0 right-full  transform-gpu transition-transform bg-[--black-olive] w-max min-w-40  rounded-md mt-10 py-4 px-3 flex flex-col max-h-[80vh] gap-3 sm:max-h-none sm:relative sm:h-full sm:m-0 sm:max-w-52 sm:right-auto '
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
              (!stateViewModule.viewModule ? 'bg-[#3D4731]' : '') +
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
          {stateModules.modules.map(({ module }) => (
            <li
              key={module.id}
              className={
                (stateViewModule.viewModule == module.id
                  ? 'bg-[#3D4731] '
                  : '') +
                'grid grid-cols-[1.2rem,1fr] gap-1 p-1 rounded-md [&>svg]:self-start [&>svg]:h-max [&>svg]:w-full transform-gpu transition-transform sm:hover:scale-105'
              }
            >
              {'number' in module ? (
                module.number != undefined &&
                numberIconsModules[module.number] ? (
                  numberIconsModules[module.number]
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
                stateModal.setDataModal({
                  title: isTp ? 'Agregar TP' : 'Agregar Examen',
                  viewModal: true,
                });
                stateForm.setDataForm({
                  onSubmit: submitAddModule,
                  children: (
                    <>
                      {isTp ? (
                        <>
                          <div className="flex flex-col">
                            <label htmlFor="name">Titulo</label>
                            <HandlerInputs
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Título del TP"
                              required={true}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label htmlFor="number">Número</label>
                            <HandlerInputs
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
                            <HandlerInputs
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
                            <HandlerInputs
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
                                  <option value="Tercer parcial">
                                    Tercer parcial
                                  </option>
                                  <option value="Final">Final</option>
                                  <option value="Otros">Otros</option>
                                </>
                              }
                            />
                          </div>
                          <div className="flex flex-col">
                            <label htmlFor="date">Fecha</label>
                            <HandlerInputs
                              type="date"
                              name="date"
                              id="date"
                              required={true}
                            />
                          </div>
                        </>
                      )}
                      <HandlerInputs
                        type="file"
                        id="file"
                        accept="application/pdf"
                        required={true}
                      />
                      <div>
                        <a
                          href="https://www.ilovepdf.com/es/eliminar-paginas"
                          target="_blank"
                          className="underline"
                        >
                          <h3 className="text-sm">
                            Click aquí para eliminar páginas de tu PDF
                          </h3>
                        </a>
                      </div>
                      <div>
                        <a
                          href="https://tools.pdf24.org/es/convertidor-pdf"
                          target="_blank"
                          className="underline"
                        >
                          <h3 className="text-sm">
                            Click aquí para convertir a PDF
                          </h3>
                        </a>
                      </div>
                      <div>
                        <h3 className="text-sm">Recuerda!</h3>
                        <p className="text-xs">
                          Solo se admite formato PDF y solo con los problemas
                          (sin las respuestas). Por favor asegurate de que el
                          modulo que quieres agregar no se encuentre ya
                          disponible en la lista. En caso de cualquier problema
                          podes contactarme:{' '}
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
                });
              }}
              aria-label={isTp ? 'Agregar TP' : 'Agregar Examen'}
              title={isTp ? 'Agregar TP' : 'Agregar Examen'}
            >
              <p className="text-base text-[--black-olive] leading-4">
                {isTp ? 'Agregar TP' : 'Agregar Examen'}
              </p>
            </button>
          </li>
        </ul>
      </aside>
    </AsideContext.Provider>
  );
};
