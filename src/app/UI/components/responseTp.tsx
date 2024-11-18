'use client';
import ButtonReaction from './buttonReaction';
import { use, useEffect, useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { tps_responses, users } from '@prisma/client';
import 'katex/dist/katex.min.css';
import { fetchUser } from '@/app/lib/data';
import PdfView from './pdfView';
import {
  BiSolidRightArrowSquare,
  BiSolidLeftArrowSquare,
} from 'react-icons/bi';
import { useSession } from 'next-auth/react';
import { MdDelete } from 'react-icons/md';

export default function ResponseTp({
  response,
  callbackDeleteResponse,
}: {
  response: [string, tps_responses[]];
  callbackDeleteResponse: (response: tps_responses | undefined) => void;
}) {
  const [indexResponse, setIndexResponse] = useState<number>(0);
  const [user, setUser] = useState<users>();
  const { data: session } = useSession();

  useEffect(() => {
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
    <li className="relative bg-[--white] p-2 text-base leading-5 shadow-md flex flex-col gap-1 min-h-32">
      <div>
        {user ? (
          <p className="bg-[#C8E0E4] p-1 rounded-md flex justify-between">
            <b className="bg-[#92C1C9] rounded-sm">{`Respuesta ${response[0]}:`}</b>
            <br />
            <span className="opacity-75">Por {`${user?.name}`}</span>
          </p>
        ) : (
          <p className="bg-[#C8E0E4] p-1 rounded-md flex justify-between">
            <b className="bg-[#92C1C9] rounded-sm">{`Respuesta ${response[0]}:`}</b>
            <br />
            <span className="opacity-75">Cargando usuario</span>
          </p>
        )}

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
          <div>
            <p>{response[1][indexResponse].text}</p>
          </div>
        ) : response[1][indexResponse].type == 1 ? (
          <div className="relative flex justify-center w-full">
            <CldImage
              src={`https://res.cloudinary.com/donzj5rlf/image/upload/f_auto,q_auto/v${Math.floor(
                Date.now() / (1000 * 60 * 60 * 24)
              )}/tps/respuestas/${response[1][indexResponse].id_tp}/${
                response[1][indexResponse].number
              }/${response[1][indexResponse].id_user}`}
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
        ) : response[1][indexResponse].type == 2 ? (
          <div className="relative overflow-hidden bg-[#C8E0E4] h-min max-w-full py-1 rounded-md sm:p-1">
            <PdfView
              id={response[1][indexResponse].id_user}
              url={`tps/respuestas/${response[1][indexResponse].id_tp}/${response[1][indexResponse].number}`}
            />
          </div>
        ) : response[1][indexResponse].type == 3 ? (
          <div className="whitespace-pre-wrap">
            <p>{response[1][indexResponse].text}</p>
          </div>
        ) : null
      }
      <ButtonReaction response={response[1][indexResponse]} />
    </li>
  );
}
