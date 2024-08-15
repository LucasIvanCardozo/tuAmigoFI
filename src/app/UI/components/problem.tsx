import Image from 'next/image';
import { TbAlertHexagon } from 'react-icons/tb';
import { AiFillLike } from 'react-icons/ai';

export default async function Problem({
  problems,
}: {
  problems: {
    number: number | null;
    response_plus: string | null;
    text: string;
    type_plus: string | null;
    response: string | null;
    type: string | null;
    id: number;
    text_normalized: string;
  };
}) {
  return (
    <li className="bg-[--white] p-2 text-base leading-5 drop-shadow-md flex flex-col gap-1">
      <p className="whitespace-pre-wrap bg-[#C8E0E4] p-1 rounded-md">
        <b className="bg-[#92C1C9] rounded-sm">{`Problema ${problems.number}:`}</b>
        <br />
        {problems.response_plus ? (
          <span
            className={`${
              problems.text.length > 200
                ? 'grid-cols-[1fr] grid-rows-[1fr,min]'
                : 'grid-cols-[1fr] grid-rows-[min,1fr]'
            } relative grid bg-[#C8E0E4] p-1`}
          >
            <span className="whitespace-pre-wrap pb-1 pr-1">
              {problems.text}
            </span>
            <span className="relative max-h-96 flex">
              <Image
                className="object-contain"
                src={`${problems.response_plus}.${problems.type_plus}`}
                width={500}
                height={500}
                alt="Imagen"
                loading="lazy"
                placeholder="empty"
              />
            </span>
          </span>
        ) : (
          <span className="whitespace-pre-wrap">{problems.text}</span>
        )}
      </p>
      {problems.response ? (
        <div className="relative flex justify-center w-full">
          <Image
            className="object-contain"
            src={`${problems.response}.${problems.type}`}
            width={500}
            height={500}
            alt="Imagen"
            placeholder="empty"
            loading="lazy"
          />
          <span className="flex absolute bottom-0 right-0 z-10 gap-1">
            <button className="flex">
              <AiFillLike className="text-xl" />
              12
            </button>
            <button className="flex">
              <TbAlertHexagon className="text-xl" />1
            </button>
          </span>
        </div>
      ) : (
        ''
      )}
    </li>
  );
}
