'use client';
import { FaStar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { fetchContributors } from '@/app/lib/data';

export default function ContributorsList() {
  const [contributors, setContributors] = useState<
    {
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
    }[]
  >();

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await fetchContributors();
      const prepareUsers = users.map((user) => ({
        ...user,
        score:
          user._count.links * 1 +
          user._count.midterms * 5 +
          user._count.tps * 6 +
          user._count.tps_reactions * 1 +
          user._count.tps_responses * 3,
      }));
      // .filter((user) => user.score > 0)
      // .sort((a, b) => b.score - a.score);
      console.log(prepareUsers);
      setContributors(prepareUsers);
    };
    fetchUsers();
  }, []);

  return (
    <ul className="flex flex-col gap-1 w-full items-center">
      {contributors?.map(({ name, score }, index) => (
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
          key={index}
        >
          <div className="flex gap-1 items-center bg-[--white] rounded-md px-1">
            {index == 0 ? (
              <FaStar className="text-amber-400" />
            ) : index == 1 ? (
              <FaStar className="text-slate-300" />
            ) : index == 2 ? (
              <FaStar className="text-amber-600" />
            ) : null}
            {name}
          </div>
          {`con ${score}Pts.`}
        </li>
      ))}
    </ul>
  );
}
