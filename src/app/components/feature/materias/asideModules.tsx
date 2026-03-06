'use client'

import { useMainContext } from '@/app/contexts'
import { useEffect, useState } from 'react'
import { numberIconsModules } from '@/app/assets/icons'
import { TbSquareAsteriskFilled, TbSquareMinusFilled } from 'react-icons/tb'
import { SiGoogledocs } from 'react-icons/si'
import { AsideMainButton } from './asideMainButton'
import { ModalAddTp } from '../../layout/modals/modalAddTp'
import { ModalAddMidterm } from '../../layout/modals/modalAddMidterm'

export const AsideModules = () => {
  const { viewModule, setViewModule, modules, course, typeModule } = useMainContext()
  const [viewAside, setViewAside] = useState(false)
  const isTp = typeModule == 'TP'

  const handleViewModules = (module: string | null) => {
    setViewAside(false)
    setViewModule(module)
  }

  useEffect(() => {
    if (viewAside) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [viewAside])

  //no bloquear el scroll en pantallas escritorio
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)') // Tailwind 'sm' breakpoint is 640px

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setViewAside(false)
      }
    }

    // Escucha los cambios de la media query
    mediaQuery.addEventListener('change', (e) => handleMediaChange(e))

    // Limpieza para remover el event listener
    return () => {
      mediaQuery.removeEventListener('change', (e) => handleMediaChange(e))
    }
  }, [])

  return (
    <>
      <AsideMainButton viewAside={viewAside} onClick={() => setViewAside(!viewAside)} />
      <aside
        className={
          (viewAside ? 'translate-x-full' : 'translate-x-0') +
          ' fixed z-40 top-0 right-full  transform-gpu transition-transform bg-[--black-olive] w-max min-w-40  rounded-md mt-10 py-4 px-3 flex flex-col max-h-[80vh] gap-3 sm:max-h-none sm:relative sm:h-full sm:m-0 sm:max-w-52 sm:right-auto '
        }
      >
        <h1 className="text-xl hidden whitespace-nowrap sm:block">{isTp ? <b>Busca tu TP</b> : <b>Exámenes</b>}</h1>
        <ul className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none' }}>
          <li
            className={
              (!viewModule ? 'bg-[#3D4731]' : '') +
              ' grid grid-cols-[1.2rem,1fr] gap-1 p-1 rounded-md [&>svg]:self-start [&>svg]:h-max [&>svg]:w-full transform-gpu transition-transform sm:hover:scale-105'
            }
          >
            <TbSquareAsteriskFilled />
            <button className="text-start" onClick={() => handleViewModules(null)} aria-label="Mostrar todos" title="Mostrar todos los TPs">
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
                module.number != undefined && numberIconsModules[module.number] ? (
                  numberIconsModules[module.number]
                ) : (
                  <TbSquareMinusFilled />
                )
              ) : (
                <SiGoogledocs />
              )}
              <button
                className="text-start"
                aria-label={'number' in module ? `Tp número ${module.number} con nombre ${module.name}` : `${module.name} del ${module.date}`}
                title={`Mostrar module ${module.name}`}
                onClick={() => handleViewModules(module.id)}
              >
                <h2 className="text-base leading-4">{module.name}</h2>
                {'number' in module ? (
                  <p className="text-xs text-[--silver]">{`Del año ${module.year}`} </p>
                ) : (
                  <p className="text-xs text-[--silver]">{`Del ${module.date.getMonth() + 1}/${module.date.getFullYear()}`} </p>
                )}
              </button>
            </li>
          ))}
          <li className={'order-last gap-1 p-1 rounded-md transform-gpu text-center transition-transform sm:hover:scale-105'}>
            <span onClick={() => setViewAside(false)}>{isTp ? <ModalAddTp course={course} /> : <ModalAddMidterm course={course} />}</span>
          </li>
        </ul>
      </aside>
    </>
  )
}
