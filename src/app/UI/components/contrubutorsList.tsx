'use client';
import { FaStar } from 'react-icons/fa';
import { useEffect } from 'react';

export default function ContributorsList({
  contributors,
  index,
}: {
  contributors: {
    score: number;
    _count: {
      links: number;
      midterms: number;
      tps: number;
      tps_reactions: number;
      tps_responses: number;
    };
    name: string;
    id: number;
    email: string;
    image: string;
    tier: number;
  };
  index: number;
}) {
  useEffect(() => {
    console.log(contributors);
  }, []);
  return (
    <li
      className={
        (index == 0
          ? 'text-2xl'
          : index == 1
          ? 'text-xl'
          : index == 2
          ? 'text-lg'
          : 'text-base') + ` flex gap-1`
      }
    >
      <div className="flex gap-1 items-center bg-[--white] rounded-md px-1">
        {index == 0 ? (
          <FaStar className="text-amber-400" />
        ) : index == 1 ? (
          <FaStar className="text-slate-300" />
        ) : index == 2 ? (
          <FaStar className="text-amber-600" />
        ) : null}
        {contributors.name}
      </div>
      {`con ${contributors.score}Pts.`}
    </li>
  );
}
