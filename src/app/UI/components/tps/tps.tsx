'use client';
import {
  TbSquareRoundedNumber0Filled,
  TbSquareRoundedNumber1Filled,
  TbSquareRoundedNumber2Filled,
  TbSquareRoundedNumber3Filled,
  TbSquareRoundedNumber4Filled,
  TbSquareRoundedNumber5Filled,
  TbSquareRoundedNumber6Filled,
  TbSquareRoundedNumber7Filled,
  TbSquareRoundedNumber8Filled,
  TbSquareRoundedNumber9Filled,
} from 'react-icons/tb';
import { fetchResponsesTp, fetchUser } from '@/app/lib/data';
import { useEffect, useState } from 'react';
import { tps_responses, tps, users } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { MdOutlineAddBox } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { MdOutlineReport } from 'react-icons/md';
import PdfView from '../pdfView';
import ResponseTp from './responseTp';
export default function Tps({
  tp,
  display,
  callbackDeleteTp,
  callbackAddResponse,
  callbackDeleteResponse,
  callbackReportTp,
}: {
  tp: tps;
  display: number | undefined;
  callbackDeleteTp: (tp: tps | undefined) => void;
  callbackAddResponse: (tp: tps | undefined) => void;
  callbackReportTp: (tp: tps | undefined) => void;
  callbackDeleteResponse: (response: tps_responses | undefined) => void;
}) {
  const numberIcons = [
    <TbSquareRoundedNumber0Filled />,
    <TbSquareRoundedNumber1Filled />,
    <TbSquareRoundedNumber2Filled />,
    <TbSquareRoundedNumber3Filled />,
    <TbSquareRoundedNumber4Filled />,
    <TbSquareRoundedNumber5Filled />,
    <TbSquareRoundedNumber6Filled />,
    <TbSquareRoundedNumber7Filled />,
    <TbSquareRoundedNumber8Filled />,
    <TbSquareRoundedNumber9Filled />,
  ];
  const [responses, setResponses] = useState<Record<number, tps_responses[]>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<users>();
  const { data: session } = useSession();

  useEffect(() => {
    setLoading(true);
    const searchProblems = async () => {
      const responses = await fetchResponsesTp({ id_tp: tp.id });
      setResponses(responses);
      setLoading(false);
    };
    const searchUser = async () => {
      const userAux = await fetchUser(tp.id_user);
      setUser(userAux);
    };
    searchUser();
    searchProblems();
  }, []);

  return (
    <li className={'relative ' + `${display && display != tp.id && 'hidden'}`}>
      <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1 ">
        {tp.number && numberIcons[tp.number]
          ? numberIcons[tp.number]
          : numberIcons[0]}
        <h2>
          {tp.name} <p className="inline-block text-base">{`(${tp.year})`}</p>
        </h2>

        <div className="flex gap-1 px-1 ml-auto [&>*]:aspect-square">
          {session && session.user.tier == 2 && (
            <button
              title="Eliminar TP"
              aria-label="Eliminar TP"
              onClick={() => callbackDeleteTp(tp)}
            >
              <MdDelete />
            </button>
          )}

          <button
            title="Añadir una respuesta"
            aria-label="Añadir una respuesta"
            onClick={() => callbackAddResponse(tp)}
          >
            <MdOutlineAddBox />
          </button>
        </div>
      </div>
      <div className="bg-[--white] p-2 text-base leading-5 drop-shadow-md flex flex-col gap-1">
        <div className="relative overflow-hidden bg-[#C8E0E4] h-min py-1 rounded-md sm:p-1">
          {user && (
            <div className="absolute z-10 bg-[--white] rounded-md m-2 opacity-65 top-0 left-0">{`Por ${user.name}`}</div>
          )}
          {session && (
            <button
              className="absolute z-10 m-2 bottom-0 right-0 w-6 h-6"
              title="Reportar TP"
              aria-label="Reportar TP"
              onClick={() => callbackReportTp(tp)}
            >
              <MdOutlineReport className="h-full w-full text-red-700" />
            </button>
          )}
          <PdfView id={tp.id} url="tps/problemas" />
        </div>
        <ul className="flex flex-col gap-1 pl-1">
          {responses == undefined || loading ? (
            <li className="pl-3">
              <p>Cargando respuestas...</p>
            </li>
          ) : Object.keys(responses).length == 0 ? (
            <li className="pl-3">
              <p>Sin respuestas :c</p>
            </li>
          ) : (
            <>
              {Object.entries(responses).map((response) => (
                <ResponseTp
                  key={response[0]}
                  response={response}
                  callbackDeleteResponse={callbackDeleteResponse}
                />
              ))}
            </>
          )}
        </ul>
      </div>
    </li>
  );
}
