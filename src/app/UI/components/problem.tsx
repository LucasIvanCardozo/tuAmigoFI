'use client';
import Image from 'next/image';
import ButtonReaction from './buttonReaction';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CldImage } from 'next-cloudinary';
import { fetchProblem } from '@/app/lib/data';
import { problems } from '@prisma/client';
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
        {problem.response_plus ? (
          <span
            className={`${
              problem.text.length > 200
                ? 'grid-cols-[1fr] grid-rows-[1fr,min]'
                : 'grid-cols-[1fr] grid-rows-[min,1fr]'
            } relative grid bg-[#C8E0E4] p-1`}
          >
            <span className="whitespace-pre-wrap pb-1 pr-1">
              {problem.text}
            </span>
            <span className="relative max-h-96 flex justify-center">
              <Image
                className="object-contain"
                src={`${problem.response_plus}.${problem.type_plus}`}
                width={500}
                height={500}
                alt="Imagen"
                loading="lazy"
                placeholder="empty"
              />
            </span>
          </span>
        ) : (
          <span className="whitespace-pre-wrap">{problem.text}</span>
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
          <ButtonReaction uuid={uuid} problem={problem} />
        </div>
      ) : problem.response == false ? (
        <span>La respuesta esta en revisión.</span>
      ) : (
        <button onClick={() => handleImportImage(problem.id)}>
          Añadir mi problema
        </button>
      )}
    </li>
  );
}
