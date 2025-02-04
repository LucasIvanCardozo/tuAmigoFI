'use client';
import ButtonReactionTp from './buttonReactionTp';
import { useEffect, useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { tps_responses, users } from '@prisma/client';
import 'katex/dist/katex.min.css';
import { fetchUser } from '@/app/lib/data';
import PdfView from '../pdfView';
import {
  BiSolidRightArrowSquare,
  BiSolidLeftArrowSquare,
} from 'react-icons/bi';
import { useSession } from 'next-auth/react';
import { MdDelete } from 'react-icons/md';
import UserResponseSkeleton from '../skeletons/userResponseSkeleton';
import { dataTpProblems } from '@/app/types';

export default function ResponseTp({
  problem,
  callbackDeleteResponse,
}: {
  problem: dataTpProblems;
  callbackDeleteResponse: (response: tps_responses | undefined) => void;
}) {
  const [indexResponse, setIndexResponse] = useState<number>(0);
  const { data: session } = useSession();
  const responses = problem.responses;

  const handlePageUser = (add: number) => {
    const suma = indexResponse + add;
    if (!(suma >= problem.responses.length || suma < 0)) {
      setIndexResponse(suma);
    }
  };

  return (
    <li className="relative bg-[--white] p-1 text-base leading-5 shadow-md flex flex-col min-h-32">
      <div>
        <p className="bg-[#C8E0E4] p-1 rounded-md flex justify-between">
          <b className="bg-[#92C1C9] rounded-sm">{`Respuesta ${problem.number}:`}</b>
          <br />
          {/* {user ? ( */}
          <span className="opacity-75">
            Por {`${responses[indexResponse].user.name}`}
          </span>
          {/* ) : (
            <UserResponseSkeleton />
          )} */}
        </p>

        <div className="w-full h-5 relative flex justify-between">
          {session && session.user.tier == 2 && (
            <button
              aria-label="Eliminar respuesta"
              title="Eliminar respuesta"
              onClick={() =>
                callbackDeleteResponse(responses[indexResponse].response)
              }
            >
              <MdDelete className="h-full w-full" />
            </button>
          )}
          <span></span>
          <div className="flex gap-1">
            <button
              className="h-full aspect-square text-[--black-olive] opacity-90"
              aria-label="Cambiar usuario que respondió hacia la izquierda"
              title="Cambiar hacia izquierda"
              onClick={() => handlePageUser(-1)}
            >
              <BiSolidLeftArrowSquare className="h-full w-full" />
            </button>
            {`${indexResponse + 1} de ${responses.length}`}
            <button
              className="h-full aspect-square text-[--black-olive] opacity-90"
              aria-label="Cambiar usuario que respondió hacia la derecha"
              title="Cambiar hacia derecha"
              onClick={() => handlePageUser(1)}
            >
              <BiSolidRightArrowSquare className="h-full w-full" />
            </button>
          </div>
        </div>
      </div>
      {
        // 0 -> texto ; 1 -> imagen ; 2 -> pdf ; 3 -> codigo
        responses[indexResponse].response.type == 0 ? (
          <div className="text-balance">
            <p>{responses[indexResponse].response.text}</p>
          </div>
        ) : responses[indexResponse].response.type == 1 ? (
          <div className="relative flex justify-center w-full max-h-250">
            <CldImage
              src={`https://res.cloudinary.com/donzj5rlf/image/upload/f_auto,q_auto/v${Math.floor(
                Date.now() / (1000 * 60 * 60 * 24 * 7)
              )}/tps/respuestas/${responses[indexResponse].response.id_tp}/${
                responses[indexResponse].response.number
              }/${responses[indexResponse].response.id_user}`}
              alt=""
              width="500"
              height="500"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        ) : responses[indexResponse].response.type == 2 ? (
          <div className="relative overflow-hidden bg-[#C8E0E4] h-min max-w-full py-1 rounded-md sm:p-1">
            <PdfView
              id={responses[indexResponse].response.id_user}
              url={`tps/respuestas/${responses[indexResponse].response.id_tp}/${responses[indexResponse].response.number}`}
            />
          </div>
        ) : responses[indexResponse].response.type == 3 ? (
          <div className="whitespace-pre-wrap">
            <p>{responses[indexResponse].response.text}</p>
          </div>
        ) : null
      }
      <ButtonReactionTp
        response={responses[indexResponse]}
      />
    </li>
  );
}
