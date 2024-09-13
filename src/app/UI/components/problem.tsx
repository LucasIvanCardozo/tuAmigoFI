'use client';
import Image from 'next/image';
import ButtonReaction from './buttonReaction';
import { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CldImage } from 'next-cloudinary';
import { fetchProblem } from '@/app/lib/data';
import { problems } from '@prisma/client';
import ContributorName from './contributorName';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
export default function Problem({
  problem,
  uuid,
}: {
  problem: problems;
  uuid: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleImportImage = (id: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('importImage', id.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <li className="bg-[--white] p-2 text-base leading-5 drop-shadow-md flex flex-col gap-1">
      <p className="whitespace-pre-wrap bg-[#C8E0E4] p-1 rounded-md">
        <b className="bg-[#92C1C9] rounded-sm">{`Problema ${problem.number}:`}</b>
        <br />
        {problem.text_plus ? (
          <span
            className={`${
              problem.text.length > 200
                ? 'grid-cols-[1fr] grid-rows-[1fr,min]'
                : 'grid-cols-[1fr] grid-rows-[min,1fr]'
            } relative grid bg-[#C8E0E4] p-1`}
          >
            <span className="whitespace-pre-wrap pb-1 pr-1">
              <Latex>{problem.text}</Latex>
            </span>
            <span className="relative max-h-96 flex justify-center">
              <Image
                className="object-contain rounded-md"
                src={`/problem-plus/${problem.id}.webp`}
                width={500}
                height={500}
                alt="Imagen"
                loading="lazy"
                placeholder="empty"
              />
            </span>
          </span>
        ) : (
          <span className="whitespace-pre-wrap">
            <Latex>{problem.text}</Latex>
          </span>
        )}
      </p>
      {problem.response ? (
        <div className="relative flex justify-center w-full">
          <CldImage
            src={problem.id.toString()}
            alt=""
            width="500"
            height="500"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: 'auto',
            }}
          />
          <Suspense>
            {problem.id_contributors ? (
              <Suspense>
                <div className="opacity-50 absolute bottom-0 left-0">
                  <ContributorName dni={problem.id_contributors} />
                </div>
              </Suspense>
            ) : null}
          </Suspense>
          <ButtonReaction uuid={uuid} problem={problem} />
        </div>
      ) : problem.response == false ? (
        <span>La respuesta esta en revisión.</span>
      ) : (
        <button
          className="flex self-end bg-[#C8E0E4] px-1 rounded-sm shadow-sm"
          onClick={() => handleImportImage(problem.id)}
        >
          Añadir mi respuesta
        </button>
      )}
    </li>
  );
}
