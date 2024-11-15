'use client';
import { SiGoogledocs } from 'react-icons/si';
import { midterms } from '@prisma/client';
import {
  MdDelete
} from 'react-icons/md';
import { useSession } from 'next-auth/react';
import PdfView from './pdfView';
import ButtonReactionMidterm from './buttonReactionMidterm';

export default function Midterm({
  midterm,
  callbackDeleteMidterm,
  callbackDeleteMidtermResponse,
  callbackAddResponse,
}: {
  midterm: midterms;
  callbackDeleteMidterm: (midterm: midterms | undefined) => void;
  callbackAddResponse: (midterm: midterms | undefined) => void;
  callbackDeleteMidtermResponse: (midterm: midterms | undefined) => void;
}) {
  const { data: session } = useSession();

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
          <PdfView id={midterm.id} url="parciales/problemas" />
        </div>
        {midterm.response ? (
          <div className="relative flex justify-center w-full">
            <PdfView id={midterm.id} url="parciales/respuestas" />
            <button
              className="absolute p-2 h-9 w-9 top-0 left-0"
              title="Eliminar respuesta del parcial"
              onClick={() => callbackDeleteMidtermResponse(midterm)}
            >
              <MdDelete className="h-full w-full" />
            </button>
            <ButtonReactionMidterm midterm={midterm} />
          </div>
        ) : (
          <button
            className="flex self-end bg-[#C8E0E4] px-1 rounded-sm shadow-sm"
            onClick={() => callbackAddResponse(midterm)}
          >
            Añadir mi respuesta
          </button>
        )}
      </div>
    </li>
  );
}
