'use client';
import Image from 'next/image';
import ButtonReaction from './buttonReaction';

export default function Problem({
  problem,
  uuid,
}: {
  problem: {
    number: number | null;
    response_plus: string | null;
    text: string;
    type_plus: string | null;
    response: string | null;
    type: string | null;
    id: number;
    text_normalized: string;
  };
  uuid: string;
}) {
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
          <Image
            className="object-contain"
            src={`${problem.response}.${problem.type}`}
            alt="Imagen"
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
            width={500}
            height={300}
          />
          <ButtonReaction uuid={uuid} problem={problem} />
        </div>
      ) : (
        ''
      )}
    </li>
  );
}
