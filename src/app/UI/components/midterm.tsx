'use client';
import { SiGoogledocs } from 'react-icons/si';
import { midterms } from '@prisma/client';
import { useEffect, useState } from 'react';
import {
  MdDelete,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function Midterm({
  midterm,
  callbackDeleteMidterm,
}: {
  midterm: midterms;
  callbackDeleteMidterm: (midterm: midterms | undefined) => void;
}) {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isTherePage, setIsTherePage] = useState<boolean>(false);
  const [loadingImage, setLoadImage] = useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    setLoadImage(true);
    const checkUrl = async () => {
      try {
        const response = await fetch(
          `https://res.cloudinary.com/donzj5rlf/image/upload/pg_${
            pageNumber + 1
          }/f_auto,q_auto:eco/v1/parciales/problemas/${midterm.id}`
        );
        if (response.ok) {
          setIsTherePage(true);
        } else {
          setIsTherePage(false);
        }
      } catch (error) {
        setIsTherePage(false);
      }
    };
    checkUrl();
  }, [pageNumber, midterm]);

  return (
    <li key={midterm.id} className="relative">
      <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1">
        <SiGoogledocs />
        <h2>
          {midterm.name}{' '}
          <p className="inline-block text-base">{`(${midterm.date.getMonth()}/${midterm.date.getFullYear()})`}</p>
        </h2>
        {session && session.user.tier == 2 && (
          <div className="flex gap-1 px-1 ml-auto [&>*]:aspect-square">
            <button
              title="Eliminar parcial"
              onClick={() => callbackDeleteMidterm(midterm)}
            >
              <MdDelete />
            </button>
          </div>
        )}
      </div>
      <div className="bg-[--white] p-2 text-base leading-5 drop-shadow-md flex flex-col gap-1">
        <div className="relative overflow-hidden bg-[#C8E0E4] h-min py-1 rounded-md sm:p-1">
          <div className="relative flex justify-center w-full">
            <Image
              src={`https://res.cloudinary.com/donzj5rlf/image/upload/pg_${pageNumber}/f_auto,q_auto/v1/parciales/problemas/${midterm.id}`}
              alt="PDF"
              onLoad={() => setLoadImage(false)}
              width={710}
              height={1000}
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-0 left-0 flex justify-center w-full">
            <div className="flex items-center">
              <span className="relative py-1">
                {pageNumber != 1 && (
                  <button
                    className="absolute right-full"
                    onClick={() => setPageNumber(pageNumber - 1)}
                  >
                    <MdOutlineKeyboardArrowLeft />
                  </button>
                )}
                Página {pageNumber}
                {isTherePage && (
                  <button
                    className="absolute left-full"
                    onClick={() => setPageNumber(pageNumber + 1)}
                  >
                    <MdOutlineKeyboardArrowRight />
                  </button>
                )}
                {loadingImage && (
                  <div className="absolute bottom-full flex justify-center w-full sm:w-full">
                    <div className="relative">
                      <div className="absolute h-3 w-3 border-[--black] border-x-2 rounded-full animate-spin"></div>
                      <div className="h-3 w-3 border-[--black] border-2 opacity-40 rounded-full animate-ping"></div>
                    </div>
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>
        {midterm.response ? (
          <div className="relative flex justify-center w-full">
            <p>PDF Respuesta</p>
          </div>
        ) : (
          <button className="flex self-end bg-[#C8E0E4] px-1 rounded-sm shadow-sm">
            Añadir mi respuesta
          </button>
        )}
      </div>
    </li>
  );
}
