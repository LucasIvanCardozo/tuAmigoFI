'use client';
import Problem from './problem';
import { fetchProblemsMidterms } from '@/app/lib/data';
import { useEffect, useState } from 'react';
import TpsSkeleton from './skeletons/tpsSkeleton';
import { SiGoogledocs } from 'react-icons/si';
import { midterms, problems } from '@prisma/client';

export default function Midterm({
  midterm,
  text,
  callback,
}: {
  midterm: midterms;
  text?: string;
  callback: (problemId: number | undefined) => void;
}) {
  const [problems, setProblems] = useState<problems[]>();

  useEffect(() => {
    const searchProblems = async () => {
      const problems = await fetchProblemsMidterms({
        id_midterm: midterm.id,
        text: text,
      });
      setProblems(problems);
    };
    searchProblems();
  }, [text]);

  return problems == undefined ? (
    <TpsSkeleton />
  ) : problems.length == 0 ? (
    <p>Sin problemas :,c</p>
  ) : (
    <li key={midterm.id} className="relative">
      <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1">
        <SiGoogledocs />
        <h2>
          {midterm.name}{' '}
          <p className="inline-block text-base">{`(${midterm.date.getMonth()}/${midterm.date.getFullYear()})`}</p>
        </h2>
      </div>
      <ul className="flex flex-col gap-1 pl-3">
        {problems.map((problem, index) => (
          <Problem
            key={index}
            problem={problem}
            callback={callback}
          />
        ))}
      </ul>
    </li>
  );
}
