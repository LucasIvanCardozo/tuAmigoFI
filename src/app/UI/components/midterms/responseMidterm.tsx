'use client';
import { useEffect, useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { midterms_responses, users } from '@prisma/client';
import 'katex/dist/katex.min.css';
import { fetchUser } from '@/app/lib/data';
import PdfView from '../pdfView';
import {
  BiSolidRightArrowSquare,
  BiSolidLeftArrowSquare,
} from 'react-icons/bi';
import { useSession } from 'next-auth/react';
import { MdDelete } from 'react-icons/md';
import ButtonReactionMidterm from './buttonReactionMidterm';
import UserResponseSkeleton from '../skeletons/userResponseSkeleton';

export default function ResponseMidterm({
  response,
  callbackDeleteResponse,
}: {
  response: [string, midterms_responses[]];
  callbackDeleteResponse: (response: midterms_responses | undefined) => void;
}) {
  const [indexResponse, setIndexResponse] = useState<number>(0);
  const [user, setUser] = useState<users>();
  const { data: session } = useSession();

  useEffect(() => {
    setUser(undefined);
    const user = async () => {
      const aux = await fetchUser(response[1][indexResponse].id_user);
      aux && setUser(aux);
    };
    user();
  }, [indexResponse]);

  const handlePageUser = (add: number) => {
    const suma = indexResponse + add;
    if (!(suma >= response[1].length || suma < 0)) {
      setIndexResponse(suma);
    }
  };

  return (
    <li className="relative bg-[--white] p-1 text-base leading-5 shadow-md flex flex-col min-h-32">
      <div>
        <p className="bg-[#C8E0E4] p-1 rounded-md flex justify-between">
          <b className="bg-[#92C1C9] rounded-sm">{`Respuesta ${response[0]}:`}</b>
          <br />
          {user ? (
            <span className="opacity-75">Por {`${user?.name}`}</span>
          ) : (
            <UserResponseSkeleton />
          )}
        </p>

        <div className="w-full h-5 relative flex justify-between">
          {session && session.user.tier == 2 && (
            <button
              title="Eliminar respuesta"
              onClick={() => callbackDeleteResponse(response[1][indexResponse])}
            >
              <MdDelete className="h-full w-full" />
            </button>
          )}
          <span></span>
          <div className="flex gap-1">
            <button
              className="h-full aspect-square text-[--black-olive] opacity-90"
              onClick={() => handlePageUser(-1)}
            >
              <BiSolidLeftArrowSquare className="h-full w-full" />
            </button>
            {`${indexResponse + 1} de ${response[1].length}`}
            <button
              className="h-full aspect-square text-[--black-olive] opacity-90"
              onClick={() => handlePageUser(1)}
            >
              <BiSolidRightArrowSquare className="h-full w-full" />
            </button>
          </div>
        </div>
      </div>
      {
        // 0 -> texto ; 1 -> imagen ; 2 -> pdf ; 3 -> codigo
        response[1][indexResponse].type == 0 ? (
          <div className="text-balance pb-4">
            <p>{response[1][indexResponse].text}</p>
          </div>
        ) : response[1][indexResponse].type == 1 ? (
          <div className="relative flex justify-center w-full max-h-250">
            <CldImage
              src={`https://res.cloudinary.com/donzj5rlf/image/upload/f_auto,q_auto/v${Math.floor(
                Date.now() / (1000 * 60 * 60 * 24 * 7)
              )}/parciales/respuestas/${
                response[1][indexResponse].id_midterm
              }/${response[1][indexResponse].number}/${
                response[1][indexResponse].id_user
              }`}
              alt=""
              width="500"
              height="500"
              style={{
                objectFit: 'contain',
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        ) : response[1][indexResponse].type == 2 ? (
          <div className="relative overflow-hidden bg-[#C8E0E4] h-min max-w-full py-1 rounded-md sm:p-1">
            <PdfView
              id={response[1][indexResponse].id_user}
              url={`parciales/respuestas/${response[1][indexResponse].id_midterm}/${response[1][indexResponse].number}`}
            />
          </div>
        ) : response[1][indexResponse].type == 3 ? (
          <div className="whitespace-pre-wrap">
            <p>{response[1][indexResponse].text}</p>
          </div>
        ) : null
      }
      <ButtonReactionMidterm response={response[1][indexResponse]} />
    </li>
  );
}
