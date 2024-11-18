'use client';
import { SiGoogledocs } from 'react-icons/si';
import { midterms, midterms_responses } from '@prisma/client';
import { MdDelete, MdOutlineAddBox } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import PdfView from '../pdfView';
import { useEffect, useState } from 'react';
import { fetchResponsesMidterm } from '@/app/lib/data';
import ResponseMidterm from './responseMidterm';

export default function Midterm({
  midterm,
  display,
  callbackDeleteMidterm,
  callbackDeleteResponse,
  callbackAddResponse,
}: {
  midterm: midterms;
  display: number | undefined;
  callbackDeleteMidterm: (midterm: midterms | undefined) => void;
  callbackAddResponse: (midterm: midterms | undefined) => void;
  callbackDeleteResponse: (response: midterms_responses | undefined) => void;
}) {
  const [responses, setResponses] =
    useState<Record<number, midterms_responses[]>>();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    setLoading(true);
    const searchProblems = async () => {
      const responses = await fetchResponsesMidterm({ id_midterm: midterm.id });
      setResponses(responses);
      setLoading(false);
    };
    searchProblems();
  }, []);

  return (
    <li
      className={
        'relative ' + `${display && display != midterm.id && 'hidden'}`
      }
    >
      <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1 ">
        <SiGoogledocs />
        <h2>
          {midterm.name}{' '}
          <p className="inline-block text-base">{`(${midterm.date.getMonth()+1}/${midterm.date.getFullYear()})`}</p>
        </h2>

        <div className="flex gap-1 px-1 ml-auto [&>*]:aspect-square">
          {session && session.user.tier == 2 && (
            <button
              title="Eliminar Parcial"
              onClick={() => callbackDeleteMidterm(midterm)}
            >
              <MdDelete />
            </button>
          )}
          <button
            title="Añadir una respuesta"
            onClick={() => callbackAddResponse(midterm)}
          >
            <MdOutlineAddBox />
          </button>
        </div>
      </div>
      <div className="bg-[--white] p-2 text-base leading-5 drop-shadow-md flex flex-col gap-1">
        <div className="relative overflow-hidden bg-[#C8E0E4] h-min py-1 rounded-md sm:p-1">
          <PdfView id={midterm.id} url="parciales/problemas" />
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
                <ResponseMidterm
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
