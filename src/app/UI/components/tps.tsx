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
import Problem from './problem';
import { fetchProblems } from '@/app/lib/data';
import { useEffect, useState } from 'react';
import TpsSkeleton from './skeletons/tpsSkeleton';
import { problems, tps } from '@prisma/client';
import { Session } from 'inspector';

export default function Tps({
  tp,
  text,
  callback,
}: {
  tp: tps;
  text?: string;
  callback: (problemId: number | undefined) => void;
}) {
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
  const [problems, setProblems] = useState<problems[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const searchProblems = async () => {
      const problems = await fetchProblems({ id_tp: tp.id, text: text });
      setProblems(problems);
      setLoading(false);
    };
    searchProblems();
  }, [text, tp]);

  return (
    <>
      <li key={tp.id} className="relative">
        <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1 ">
          {tp.number && numberIcons[tp.number]
            ? numberIcons[tp.number]
            : numberIcons[0]}
          <h2>
            {tp.name} <p className="inline-block text-base">{`(${tp.year})`}</p>
          </h2>
        </div>
        {problems == undefined || loading ? (
          <p>Hola</p>
        ) : problems.length == 0 ? (
          <p className="pl-3">Sin problemas :c</p>
        ) : (
          <ul className="flex flex-col gap-1 pl-3">
            {problems.map((problem, index) => (
              <Problem key={index} problem={problem} callback={callback} />
            ))}
          </ul>
        )}
      </li>
    </>
  );

  problems == undefined || loading ? (
    <TpsSkeleton />
  ) : problems.length == 0 ? (
    <li key={tp.id} className="relative">
      <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1 ">
        {tp.number && numberIcons[tp.number]
          ? numberIcons[tp.number]
          : numberIcons[0]}
        <h2>
          {tp.name} <p className="inline-block text-base">{`(${tp.year})`}</p>
        </h2>
      </div>
      <p className="pl-3">Sin problemas :c</p>
    </li>
  ) : (
    <li key={tp.id} className="relative">
      <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1 ">
        {tp.number && numberIcons[tp.number]
          ? numberIcons[tp.number]
          : numberIcons[0]}
        <h2>
          {tp.name} <p className="inline-block text-base">{`(${tp.year})`}</p>
        </h2>
      </div>
      <ul className="flex flex-col gap-1 pl-3">
        {problems.map((problem, index) => (
          <Problem key={index} problem={problem} callback={callback} />
        ))}
      </ul>
    </li>
  );
}
