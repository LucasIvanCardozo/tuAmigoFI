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
import Problem from './problem';
import { fetchProblems } from '@/app/lib/data';
import { useEffect, useState } from 'react';
import TpsSkeleton from './skeletons/tpsSkeleton';
import { tps_responses, tps } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { MdOutlineAddBox } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import PdfView from './pdfView';
import ResponseTp from './responseTp';
export default function Tps({
  tp,
  text,
  callbackImage,
  callbackDeleteTp,
  callbackAddResponse,
}: {
  tp: tps;
  text?: string;
  callbackImage: (problemId: number | undefined) => void;
  callbackDeleteTp: (tp: tps | undefined) => void;
  callbackAddResponse: (tp: tps | undefined) => void;
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
  const [problems, setProblems] = useState<Record<number, tps_responses[]>>();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    setLoading(true);
    const searchProblems = async () => {
      const problems = await fetchProblems({ id_tp: tp.id, text: text });
      setTimeout(() => {
        setProblems(problems);
        setLoading(false);
      }, 1000);
    };
    searchProblems();
  }, [text, tp]);

  return (
    <>
      <li key={tp.id} className="relative">
        <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1 ">
          {tp.number && numberIcons[tp.number]
            ? numberIcons[tp.number]
            : numberIcons[0]}
          <h2>
            {tp.name} <p className="inline-block text-base">{`(${tp.year})`}</p>
          </h2>
          {session && session.user.tier == 2 && (
            <div className="flex gap-1 px-1 ml-auto [&>*]:aspect-square">
              <button title="Eliminar TP" onClick={() => callbackDeleteTp(tp)}>
                <MdDelete />
              </button>
              <button
                title="Añadir una respuesta"
                onClick={() => callbackAddResponse(tp)}
              >
                <MdOutlineAddBox />
              </button>
            </div>
          )}
        </div>
        <div className="bg-[--white] p-2 text-base leading-5 drop-shadow-md flex flex-col gap-1">
          <div className="relative overflow-hidden bg-[#C8E0E4] h-min py-1 rounded-md sm:p-1">
            <PdfView id={tp.id} url="tps/problemas" />
          </div>
          {problems == undefined || loading ? (
            <ul className="flex h-96 flex-col z-10 grow relative overflow-y-auto">
              <TpsSkeleton />
            </ul>
          ) : Object.keys(problems).length == 0 ? (
            <p className="pl-3">Sin respuestas :c</p>
          ) : (
            <ul className="flex flex-col gap-1 pl-3">
              {Object.entries(problems).map((response, index) => (
                <ResponseTp
                  key={index}
                  response={response}
                  callback={callbackImage}
                />
              ))}
            </ul>
          )}
        </div>
      </li>
    </>
  );
}
