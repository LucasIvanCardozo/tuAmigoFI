'use client';
import Image from 'next/image';
import ButtonReaction from './buttonReaction';
import { Suspense, use, useEffect, useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { tps_responses, users } from '@prisma/client';
import ContributorName from './contributorName';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { Session } from 'inspector';
import { fetchProblems, fetchUser } from '@/app/lib/data';
export default function ResponseTp({
  response,
  callback,
}: {
  response: [string, tps_responses[]];
  callback: (responseId: number | undefined) => void;
}) {
  const [indexResponse, setIndexResponse] = useState<number>(0);
  const [user, setUser] = useState<users>();
  useEffect(() => {
    const user = async () => {
      const aux = await fetchUser(response[1][indexResponse].id_user);
      aux && setUser(aux);
    };
    user();
  }, [indexResponse]);

  return (
    <li className="bg-[--white] p-2 text-base leading-5 drop-shadow-md flex flex-col gap-1 min-h-32">
      <p className="whitespace-pre-wrap bg-[#C8E0E4] p-1 rounded-md flex justify-between">
        <b className="bg-[#92C1C9] rounded-sm">{`Problema ${response[0]}:`}</b>
        <br />
        <span className="opacity-65">
          Respondido por {user?.name?.split(' ')[0]}
        </span>
      </p>
      {
        // 0 -> texto ; 1 -> imagen ; 2 -> pdf ; 3 -> codigo
        response[1][indexResponse].type == 0 ? (
          <div>
            <p>{response[1][indexResponse].text}</p>
          </div>
        ) : response[1][indexResponse].type == 1 ? (
          <div></div>
        ) : response[1][indexResponse].type == 2 ? (
          <div></div>
        ) : response[1][indexResponse].type == 3 ? (
          <div className="whitespace-pre-wrap">
            <p>{response[1][indexResponse].text}</p>
          </div>
        ) : null
      }
    </li>
  );
}
