'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CgClose, CgMenu } from 'react-icons/cg';
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

export default function AsideProblems({
  tpList,
}: {
  tpList: {
    id: number;
    name: string;
    number: number | null;
    year: number;
  }[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
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
  const [tpsState, setTpsState] = useState<boolean>(false);

  const handleTpsState = () => {
    setTpsState(!tpsState);
  };

  const handleTps = (tp: string) => {
    setTpsState(false);
    const params = new URLSearchParams(searchParams);
    if (tp) {
      params.set('tps', tp);
    } else {
      params.delete('tps');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (tpsState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [tpsState]);

  //no bloquear el scroll en pantallas escritorio
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)'); // Tailwind 'sm' breakpoint is 640px

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setTpsState(false);
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
        onClick={handleTpsState}
      >
        <CgMenu
          className={
            (tpsState ? 'opacity-0' : 'opacity-100') +
            ' transform-gpu transition-opacity absolute top-0 left-0 w-full h-full p-1'
          }
        />
        <CgClose
          className={
            (tpsState ? 'opacity-100' : 'opacity-0') +
            ' transform-gpu transition-opacity absolute top-0 left-0 w-full h-full p-1'
          }
        />
        <div className="absolute h-8 left-full top-0 text-xl bg-[--black-olive] drop-shadow-sm rounded-md px-1 flex items-center justify-center rounded-s-none text-nowrap sm:hidden">
          <b className="">Busca tu TP</b>
        </div>
      </button>
      <aside
        className={
          (tpsState ? 'translate-x-full' : 'translate-x-0') +
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
              (!searchParams.get('tps') ? 'bg-[#3D4731]' : '') +
              ' grid grid-cols-[1.2rem,1fr] gap-1 p-1 rounded-md [&>svg]:self-start [&>svg]:h-max [&>svg]:w-full transform-gpu transition-transform sm:hover:scale-105'
            }
          >
            {numberIcons[0]}
            <button className="text-start" onClick={() => handleTps('')}>
              <h3 className="text-base leading-4">Mostrar todos</h3>
              <p className="text-xs text-[--silver]">
                {`Todos los TPs disponibles`}{' '}
              </p>
            </button>
          </li>
          {tpList.map(({ id, name, number, year }) => (
            <li
              key={id}
              className={
                (searchParams.get('tps') == id.toString()
                  ? 'bg-[#3D4731]'
                  : '') +
                ' grid grid-cols-[1.2rem,1fr] gap-1 p-1 rounded-md [&>svg]:self-start [&>svg]:h-max [&>svg]:w-full transform-gpu transition-transform sm:hover:scale-105'
              }
            >
              {number && numberIcons[number]
                ? numberIcons[number]
                : numberIcons[0]}
              <button
                className="text-start"
                onClick={() => handleTps(id.toString())}
              >
                <h3 className="text-base leading-4">{name}</h3>
                <p className="text-xs text-[--silver]">{`Del año ${year}`} </p>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
