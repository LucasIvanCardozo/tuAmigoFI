'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
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

  return (
    <>
      <button
        className="fixed top-0 left-0 m-1 h-8 bg-[--black-olive] rounded-md aspect-square z-50 sm:hidden"
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
      </button>
      <aside
        className={
          (tpsState ? 'translate-x-full' : 'translate-x-0') +
          ' fixed z-40 top-0 right-full  transform-gpu transition-transform bg-[--black-olive] w-max min-w-40  rounded-md mt-10 py-4 px-3 flex flex-col gap-3 sm:relative sm:h-full sm:m-0 sm:max-w-52 sm:translate-x-0 sm:right-auto '
        }
      >
        <h1 className="text-xl">
          <b>Busca tu TP</b>
        </h1>
        <ul className="flex flex-col gap-3">
          <li
            className={
              (!searchParams.get('tps') ? 'bg-[#3D4731]' : '') +
              ' grid grid-cols-[1.2rem,1fr] gap-1 p-1 rounded-md [&>svg]:self-start [&>svg]:h-max [&>svg]:w-full'
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
                ' grid grid-cols-[1.2rem,1fr] gap-1 p-1 rounded-md [&>svg]:self-start [&>svg]:h-max [&>svg]:w-full'
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
